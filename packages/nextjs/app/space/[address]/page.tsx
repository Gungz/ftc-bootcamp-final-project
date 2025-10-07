"use client";

import { use } from "react";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import { MembershipCard } from "../_components/MembershipCard";
import { TipCreator } from "../_components/TipCreator";
import { LikeButton } from "../_components/LikeButton";
import { ContentGallery } from "../_components/ContentGallery";
import { useCreatorSpaceData } from "~~/hooks/creator-platform/useCreatorSpace";

const SpacePage: NextPage<{ params: Promise<{ address: string }> }> = ({ params }) => {
  const { address } = use(params);
  const space = useCreatorSpaceData(address);

  if (!space) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center text-4xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10 px-4">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Creator Space</h1>
            <Address address={address} />
          </div>
          <LikeButton spaceAddress={address} nftAddress={space.membershipNFT} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <MembershipCard nftAddress={space.membershipNFT} />
          <TipCreator spaceAddress={address} nftAddress={space.membershipNFT} />
        </div>

        <ContentGallery 
          nftAddress={space.membershipNFT} 
          contentAddress={space.exclusiveContent} 
        />
      </div>
    </div>
  );
};

export default SpacePage;
