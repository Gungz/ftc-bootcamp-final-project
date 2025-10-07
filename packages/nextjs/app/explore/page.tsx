"use client";

import type { NextPage } from "next";
import { CreatorCard } from "./_components/CreatorCard";
import { useGetAllCreatorSpaces } from "~~/hooks/creator-platform/useCreatorPlatform";
import { useCreatorSpaceData } from "~~/hooks/creator-platform/useCreatorSpace";
import { useMembershipPrice, useTotalSupply } from "~~/hooks/creator-platform/useMembershipNFT";
import { formatEther } from "viem";

import { mockCreators } from "~~/utils/creator-platform/mockData";


const CreatorCardWrapper = ({ spaceAddress }: { spaceAddress: string }) => {
  const space = useCreatorSpaceData(spaceAddress);
  const membershipPrice = useMembershipPrice(space?.membershipNFT || "");
  const totalSupply = useTotalSupply(space?.membershipNFT || "");

  if (!space) return null;
  
  return (
    <CreatorCard
      address={spaceAddress}
      name={space.description || "Creator Space"}
      memberCount={totalSupply ? Number(totalSupply) : 0}
      membershipPrice={membershipPrice ? formatEther(membershipPrice) : "0"}
      description={space.description || ""}
    />
  );
};

const ExplorePage: NextPage = () => {
  const creatorSpaces = useGetAllCreatorSpaces();
  
  const displayCreators = creatorSpaces.length > 0 ? creatorSpaces : mockCreators;

  return (
    <div className="flex items-center flex-col flex-grow pt-10 px-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Explore Creators Spaces</h1>
        
        {displayCreators.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl opacity-70">No creators yet. Be the first to create a space!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creatorSpaces.length > 0 ? (
              creatorSpaces.map((spaceAddress: string, index: number) => (
                <CreatorCardWrapper key={index} spaceAddress={spaceAddress} />
              ))
            ) : (
              <span>No Creator Space yet</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
