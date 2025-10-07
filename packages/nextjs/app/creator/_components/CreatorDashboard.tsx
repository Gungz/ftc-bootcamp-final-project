"use client";

import { Address } from "~~/components/scaffold-eth";
import { shortenAddress } from "~~/utils/creator-platform/formatters";

interface CreatorSpace {
  membershipNFT: string;
  exclusiveContent: string;
  crowdfunding: string;
  creator: string;
}

export const CreatorDashboard = ({ space }: { space: CreatorSpace }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Your Creator Space</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm opacity-70">Membership NFT</p>
            <Address address={space.membershipNFT} />
          </div>
          <div>
            <p className="text-sm opacity-70">Exclusive Content</p>
            <Address address={space.exclusiveContent} />
          </div>
          <div>
            <p className="text-sm opacity-70">Crowdfunding</p>
            <Address address={space.crowdfunding} />
          </div>
          <div className="divider"></div>
          <div className="flex gap-2">
            <button className="btn btn-sm btn-primary">Manage Membership</button>
            <button className="btn btn-sm btn-secondary">Create Content</button>
          </div>
        </div>
      </div>
    </div>
  );
};
