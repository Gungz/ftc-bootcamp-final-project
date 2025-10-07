"use client";

import { useState } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useAccount } from "wagmi";
import { useIsMember } from "~~/hooks/creator-platform/useMembershipNFT";
import { useCreatorSpaceLike, useTotalLikes, useUserLikes } from "~~/hooks/creator-platform/useCreatorSpaceActions";

export const LikeButton = ({ spaceAddress, nftAddress }: { spaceAddress: string; nftAddress: string }) => {
  const { address } = useAccount();
  const isMember = useIsMember(nftAddress, address);
  const totalLikes = useTotalLikes(spaceAddress);
  const userLikes = useUserLikes(spaceAddress, address);
  const { like } = useCreatorSpaceLike(spaceAddress);
  const [loading, setLoading] = useState(false);

  const hasLiked = userLikes && userLikes > 0n;

  const handleLike = async () => {
    if (!isMember || loading || hasLiked) return;
    
    setLoading(true);
    try {
      await like();
    } catch (error) {
      console.error("Error liking:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isMember) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button 
        className="btn btn-ghost p-2" 
        onClick={handleLike}
        disabled={loading || hasLiked}
      >
        {hasLiked ? (
          <HeartSolidIcon className="h-16 w-16 text-error" />
        ) : (
          <HeartIcon className="h-16 w-16" />
        )}
      </button>
      <span className="badge badge-lg">{totalLikes ? totalLikes.toString() : "0"} likes</span>
    </div>
  );
};
