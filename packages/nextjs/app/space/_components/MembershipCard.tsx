"use client";

import { useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useMembershipNFT, useIsMember, useMembershipPrice } from "~~/hooks/creator-platform/useMembershipNFT";

export const MembershipCard = ({ nftAddress }: { nftAddress: string }) => {
  const { address } = useAccount();
  const isMember = useIsMember(nftAddress, address);
  const membershipPrice = useMembershipPrice(nftAddress);
  const { mintMembership } = useMembershipNFT(nftAddress);
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    if (!membershipPrice) return;
    
    setLoading(true);
    try {
      await mintMembership(membershipPrice);
    } catch (error) {
      console.error("Error minting membership:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isMember) {
    return (
      <div className="alert alert-success">
        <span>✓ You are a member of this space!</span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Become a Member</h2>
        <p>Join this creator's exclusive community</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold">
            {membershipPrice ? formatEther(membershipPrice) : "..."} ETH
          </span>
          <button 
            className="btn btn-primary" 
            onClick={handleMint}
            disabled={loading || !membershipPrice}
          >
            {loading ? <span className="loading loading-spinner"></span> : "Mint Membership"}
          </button>
        </div>
      </div>
    </div>
  );
};
