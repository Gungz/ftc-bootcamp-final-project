"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useIsMember } from "~~/hooks/creator-platform/useMembershipNFT";
import { getFile } from "~~/services/ipfs/ipfsClient";
import ExclusiveContentAbi from "~~/contracts/ExclusiveContent.json";

export const ContentGallery = ({ nftAddress, contentAddress }: { nftAddress: string; contentAddress: string }) => {
  const { address } = useAccount();
  const isMember = useIsMember(nftAddress, address);
  const [loading, setLoading] = useState<number | null>(null);

  const { data: contentCount } = useReadContract({
    address: contentAddress as `0x${string}`,
    abi: ExclusiveContentAbi,
    functionName: "getContentCount",
  });

  const { writeContractAsync } = useWriteContract();

  const handleMint = async (contentId: number, price: bigint) => {
    if (!isMember) return;
    
    setLoading(contentId);
    try {
      await writeContractAsync({
        address: contentAddress as `0x${string}`,
        abi: ExclusiveContentAbi,
        functionName: "mintContent",
        args: [BigInt(contentId), BigInt(1)],
        value: price,
      });
    } catch (error) {
      console.error("Error minting content:", error);
    } finally {
      setLoading(null);
    }
  };

  if (!isMember) {
    return (
      <div className="alert alert-warning">
        <span>Become a member to access exclusive content</span>
      </div>
    );
  }

  const count = contentCount ? Number(contentCount) : 0;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Exclusive Content</h2>
      {count === 0 ? (
        <p className="text-center opacity-70">No content available yet</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: count }, (_, i) => (
            <ContentCard
              key={i}
              contentAddress={contentAddress}
              contentId={i}
              onMint={handleMint}
              loading={loading === i}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ContentCard = ({
  contentAddress,
  contentId,
  onMint,
  loading,
}: {
  contentAddress: string;
  contentId: number;
  onMint: (id: number, price: bigint) => void;
  loading: boolean;
}) => {
  const { address } = useAccount();
  const [fileName, setFileName] = useState<string>("");

  const { data } = useReadContract({
    address: contentAddress as `0x${string}`,
    abi: ExclusiveContentAbi,
    functionName: "contentItems",
    args: [BigInt(contentId)],
  });

  const { data: balance } = useReadContract({
    address: contentAddress as `0x${string}`,
    abi: [{
      "inputs": [{"internalType": "address", "name": "account", "type": "address"}, {"internalType": "uint256", "name": "id", "type": "uint256"}],
      "name": "balanceOf",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }],
    functionName: "balanceOf",
    args: [address, BigInt(contentId)],
  });

  useEffect(() => {
    if (data) {
      const item = data as any;
      const uri = item[3];
      const cid = uri.replace("ipfs://", "");

      getFile(cid).then(file => {
        if (file?.files[0].name) {
          setFileName(file?.files[0].name);
        }
      });
    }
  }, [data]);

  if (!data) return null;

  const item = data as any;
  const price = item[0];
  const maxSupply = item[1];
  const currentSupply = item[2];
  const uri = item[3];
  const soldOut = currentSupply >= maxSupply;
  const hasMinted = balance && Number(balance) > 0;
  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${uri.replace("ipfs://", "")}`;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">{fileName || `Content #${contentId + 1}`}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm">
            {currentSupply.toString()}/{maxSupply.toString()} minted
          </span>
          <span className="font-bold">{formatEther(price)} ETH</span>
        </div>
        <progress
          className="progress progress-primary"
          value={Number(currentSupply)}
          max={Number(maxSupply)}
        ></progress>
        {hasMinted ? (
          <a
            href={ipfsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success btn-sm mt-2"
          >
            Download / View Content
          </a>
        ) : (
          <button
            className="btn btn-primary btn-sm mt-2"
            onClick={() => onMint(contentId, price)}
            disabled={loading || soldOut}
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : soldOut ? (
              "Sold Out"
            ) : (
              "Mint NFT"
            )}
          </button>
        )}
      </div>
    </div>
  );
};
