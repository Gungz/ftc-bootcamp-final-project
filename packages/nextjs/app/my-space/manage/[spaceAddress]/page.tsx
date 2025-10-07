"use client";

import { use } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { ContentManager } from "~~/app/creator/_components/ContentManager";
import { formatEther } from "viem";
import { useMembershipPrice, useMembershipNFT } from "~~/hooks/creator-platform/useMembershipNFT";
import { useCreatorSpaceData } from "~~/hooks/creator-platform/useCreatorSpace";
import { useState } from "react";

const ManageSpacePage: NextPage<{ params: Promise<{ spaceAddress: string }> }> = ({ params }) => {
  const { spaceAddress } = use(params);
  const { address } = useAccount();
  const space = useCreatorSpaceData(spaceAddress);
  const membershipPrice = useMembershipPrice(space?.membershipNFT || "");
  const { setMembershipPrice, withdraw } = useMembershipNFT(space?.membershipNFT || "");
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePrice = async () => {
    if (!newPrice) return;
    setLoading(true);
    try {
      await setMembershipPrice(BigInt(parseFloat(newPrice) * 1e18));
      setNewPrice("");
    } catch (error) {
      console.error("Error updating price:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      await withdraw();
    } catch (error) {
      console.error("Error withdrawing:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 text-center">
          <h1 className="text-4xl font-bold mb-4">Manage Space</h1>
          <p className="text-lg">Please connect your wallet</p>
        </div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 text-center">
          <h1 className="text-4xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10 px-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Manage Your Space</h1>

        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Space Details</h2>
              <div>
                <p className="text-sm opacity-70">Space Address</p>
                <Address address={spaceAddress} />
              </div>
              <div>
                <p className="text-sm opacity-70">Membership NFT Address</p>
                <Address address={space.membershipNFT} />
              </div>
              <div>
                <p className="text-sm opacity-70">Exclusive Content Address</p>
                <Address address={space.exclusiveContent} />
              </div>
              <div>
                <p className="text-sm opacity-70">Crowdfunding Address</p>
                <Address address={space.crowdfunding} />
              </div>
              <div>
                <p className="text-sm opacity-70">Current Membership Price</p>
                <p className="font-bold text-2xl">{membershipPrice ? formatEther(membershipPrice) : "..."} GUNG</p>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Update Membership Price</h2>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.001"
                  placeholder="New price in GUNG"
                  className="input input-bordered flex-1"
                  value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleUpdatePrice} disabled={loading || !newPrice}>
                  {loading ? <span className="loading loading-spinner"></span> : "Update Price"}
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Withdraw Funds</h2>
              <p className="text-sm opacity-70">Withdraw all membership sales to your wallet</p>
              <button className="btn btn-secondary" onClick={handleWithdraw} disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : "Withdraw All Funds"}
              </button>
            </div>
          </div>

          <ContentManager contentAddress={space.exclusiveContent} />
        </div>
      </div>
    </div>
  );
};

export default ManageSpacePage;
