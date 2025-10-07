"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { useIsMember } from "~~/hooks/creator-platform/useMembershipNFT";
import CreatorSpaceAbi from "~~/contracts/CreatorSpace.json";

export const TipCreator = ({ spaceAddress, nftAddress }: { spaceAddress: string; nftAddress: string }) => {
  const { address } = useAccount();
  const isMember = useIsMember(nftAddress, address);
  const { writeContractAsync } = useWriteContract();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTip = async () => {
    if (!amount || !isMember) return;
    
    setLoading(true);
    try {
      await writeContractAsync({
        address: spaceAddress as `0x${string}`,
        abi: CreatorSpaceAbi,
        functionName: "tip",
        args: [message || ""],
        value: parseEther(amount),
      });
      setAmount("");
      setMessage("");
    } catch (error) {
      console.error("Error tipping:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isMember) {
    return (
      <div className="alert alert-warning">
        <span>Become a member to tip this creator</span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Tip Creator</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Amount (ETH)</span>
          </label>
          <input
            type="number"
            step="0.001"
            placeholder="0.01"
            className="input input-bordered"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Message (optional)</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Great work!"
            value={message}
            onChange={e => setMessage(e.target.value)}
            maxLength={200}
          />
        </div>
        <button 
          className="btn btn-primary mt-4" 
          onClick={handleTip}
          disabled={loading || !amount}
        >
          {loading ? <span className="loading loading-spinner"></span> : "Send Tip"}
        </button>
      </div>
    </div>
  );
};
