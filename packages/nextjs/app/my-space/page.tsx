"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import Link from "next/link";
import { SpaceCard } from "./_components/SpaceCard";
import { useGetCreatorSpaces } from "~~/hooks/creator-platform/useCreatorPlatform";
import { useCreatorSpaceData } from "~~/hooks/creator-platform/useCreatorSpace";

const SpaceCardWrapper = ({ spaceAddress }: { spaceAddress: string }) => {
  const space = useCreatorSpaceData(spaceAddress);
  if (!space) return null;
  return (
    <SpaceCard
      spaceAddress={spaceAddress}
      membershipNFT={space.membershipNFT}
      exclusiveContent={space.exclusiveContent}
      crowdfunding={space.crowdfunding}
      creator={space.creator}
    />
  );
};

const MySpacePage: NextPage = () => {
  const { address } = useAccount();
  const spaces = useGetCreatorSpaces(address || "");
  const hasSpaces = spaces.length > 0;

  if (!address) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 text-center">
          <h1 className="text-4xl font-bold mb-4">My Space</h1>
          <p className="text-lg">Please connect your wallet to view your spaces</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10 px-4">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Space</h1>
          {!hasSpaces && (
            <Link href="/creator" className="btn btn-primary">
              Create Your First Space
            </Link>
          )}
        </div>

        {!hasSpaces ? (
          <div className="text-center py-20">
            <p className="text-xl opacity-70 mb-4">You don't have any creator spaces yet</p>
            <p className="opacity-60">Create your first space to start building your community</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((spaceAddress, index) => (
              <SpaceCardWrapper key={index} spaceAddress={spaceAddress} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySpacePage;
