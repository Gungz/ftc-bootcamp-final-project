"use client";

import { useState, useEffect } from "react";
import { parseEther, formatEther } from "viem";
import { useWriteContract, useReadContract } from "wagmi";
import { uploadFile, getFile } from "~~/services/ipfs/ipfsClient";
import ExclusiveContentAbi from "~~/contracts/ExclusiveContent.json";

export const ContentManager = ({ contentAddress }: { contentAddress: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [maxSupply, setMaxSupply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const getFileType = (file: File): string => {
    const mimeType = file.type;
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    return "document";
  };

  const { writeContractAsync } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !price || !maxSupply) return;

    setLoading(true);
    try {
      const fileType = getFileType(file);
      const fileHash = await uploadFile(file, fileType, name);
      
      /*const metadata = {
        name,
        type: fileType,
        file: `ipfs://${fileHash}`,
      };
      const metadataHash = await uploadJSON(metadata);*/
      
      await writeContractAsync({
        address: contentAddress as `0x${string}`,
        abi: ExclusiveContentAbi,
        functionName: "createContent",
        args: [parseEther(price), BigInt(maxSupply), `ipfs://${fileHash}`],
      });
      
      setFile(null);
      setName("");
      setPrice("");
      setMaxSupply("");
    } catch (error) {
      console.error("Error creating content:", error);
    } finally {
      setLoading(false);
    }
  };

  const { data: contentCounter } = useReadContract({
    address: contentAddress as `0x${string}`,
    abi: ExclusiveContentAbi,
    functionName: "getContentCount",
  });

  const contentCount = contentCounter ? Number(contentCounter) : 0;

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Create Exclusive Content</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Content File</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered"
              onChange={handleFileChange}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Exclusive Album"
              className="input input-bordered"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Price (ETH)</span>
            </label>
            <input
              type="number"
              step="0.001"
              placeholder="0.1"
              className="input input-bordered"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Max Supply</span>
            </label>
            <input
              type="number"
              placeholder="100"
              className="input input-bordered"
              value={maxSupply}
              onChange={e => setMaxSupply(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? <span className="loading loading-spinner"></span> : "Create Content NFT"}
          </button>
        </form>
        </div>
      </div>

      {contentCount > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Your Content</h2>
            <div className="space-y-4">
              {Array.from({ length: contentCount }, (_, i) => (
                <ContentItem key={i} contentAddress={contentAddress} contentId={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ContentItem = ({ contentAddress, contentId }: { contentAddress: string; contentId: number }) => {
  const [fileName, setFileName] = useState<string>("");
  
  const { data } = useReadContract({
    address: contentAddress as `0x${string}`,
    abi: ExclusiveContentAbi,
    functionName: "contentItems",
    args: [BigInt(contentId)],
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

  return (
    <div className="border border-base-300 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold">{fileName || `Content #${contentId + 1}`}</p>
          <p className="text-sm opacity-70">{uri}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">{formatEther(price)} ETH</p>
          <p className="text-sm opacity-70">{currentSupply.toString()}/{maxSupply.toString()} minted</p>
        </div>
      </div>
    </div>
  );
};
