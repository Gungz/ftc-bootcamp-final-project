"use client";

import Link from "next/link";
import { Address } from "~~/components/scaffold-eth";
import { formatEther } from "viem";
import { useMembershipPrice } from "~~/hooks/creator-platform/useMembershipNFT";

interface SpaceCardProps {
  spaceAddress: string;
  membershipNFT: string;
  exclusiveContent: string;
  crowdfunding: string;
  creator: string;
}

export const SpaceCard = ({ spaceAddress, membershipNFT, exclusiveContent, crowdfunding, creator }: SpaceCardProps) => {
  const membershipPrice = useMembershipPrice(membershipNFT);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">My Creator Space</h2>
        <div className="space-y-2">
          <div>
            <p className="text-xs opacity-70">Membership NFT</p>
            <Address address={membershipNFT} />
          </div>
          <div>
            <p className="text-xs opacity-70">Membership Price</p>
            <p className="font-bold">{membershipPrice ? formatEther(membershipPrice) : "..."} GUNG</p>
          </div>
        </div>
        <div className="card-actions justify-end mt-4">
          <Link href={`/space/${spaceAddress}`} className="btn btn-sm btn-secondary">
            View Public Page
          </Link>
          <Link href={`/my-space/manage/${spaceAddress}`} className="btn btn-sm btn-primary">
            Manage Space
          </Link>
        </div>
      </div>
    </div>
  );
};
