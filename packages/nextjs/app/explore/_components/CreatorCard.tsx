"use client";

import Link from "next/link";
import { Address } from "~~/components/scaffold-eth";

interface CreatorCardProps {
  address: string;
  name: string;
  memberCount: number;
  membershipPrice: string;
  description: string;
}

export const CreatorCard = ({ address, name, memberCount, membershipPrice, description }: CreatorCardProps) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <Address address={address} />
        <p className="text-sm opacity-70">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-xs opacity-70">Members</p>
            <p className="font-bold">{memberCount}</p>
          </div>
          <div>
            <p className="text-xs opacity-70">Membership</p>
            <p className="font-bold">{membershipPrice} ETH</p>
          </div>
        </div>
        <div className="card-actions justify-end mt-4">
          <Link href={`/space/${address}`} className="btn btn-primary btn-sm">
            View Space
          </Link>
        </div>
      </div>
    </div>
  );
};
