import { useReadContract, useWriteContract, useBlockNumber } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import CreatorSpaceAbi from "~~/contracts/CreatorSpace.json";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

export const useCreatorSpaceLike = (spaceAddress: string) => {
  const { writeContractAsync } = useWriteContract();

  const like = async () => {
    return await writeContractAsync({
      address: spaceAddress as `0x${string}`,
      abi: CreatorSpaceAbi,
      functionName: "like",
    });
  };

  return { like };
};

export const useTotalLikes = (spaceAddress: string) => {
  const { targetNetwork } = useTargetNetwork();
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true, chainId: targetNetwork.id });

  const { data, queryKey } = useReadContract({
    address: spaceAddress as `0x${string}`,
    abi: CreatorSpaceAbi,
    functionName: "totalLikes",
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  return data as bigint | undefined;
};

export const useUserLikes = (spaceAddress: string, userAddress?: string) => {
  const { targetNetwork } = useTargetNetwork();
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true, chainId: targetNetwork.id });

  const { data, queryKey } = useReadContract({
    address: spaceAddress as `0x${string}`,
    abi: CreatorSpaceAbi,
    functionName: "userLikes",
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  return data as bigint | undefined;
};
