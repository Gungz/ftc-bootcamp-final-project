import { useReadContract, useWriteContract, useBlockNumber } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import MembershipNFTAbi from "~~/contracts/MembershipNFT.json";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

export const useMembershipNFT = (contractAddress: string) => {
  const { writeContractAsync } = useWriteContract();

  const mintMembership = async (value: bigint) => {
    return await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: MembershipNFTAbi,
      functionName: "mintMembership",
      value,
    });
  };

  const setMembershipPrice = async (newPrice: bigint) => {
    return await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: MembershipNFTAbi,
      functionName: "setMembershipPrice",
      args: [newPrice],
    });
  };

  const withdraw = async () => {
    return await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: MembershipNFTAbi,
      functionName: "withdraw",
    });
  };

  return {
    mintMembership,
    setMembershipPrice,
    withdraw,
  };
};

export const useIsMember = (contractAddress: string, userAddress?: string) => {
  const { data } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: MembershipNFTAbi,
    functionName: "isMember",
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  });

  return data as boolean;
};

export const useMembershipPrice = (contractAddress: string) => {
  const { targetNetwork } = useTargetNetwork();
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true, chainId: targetNetwork.id });
  
  const { data, queryKey } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: MembershipNFTAbi,
    functionName: "membershipPrice",
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  return data as bigint;
};

export const useTotalSupply = (contractAddress: string) => {
  const { targetNetwork } = useTargetNetwork();
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true, chainId: targetNetwork.id });
  
  const { data, queryKey } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: MembershipNFTAbi,
    functionName: "totalMembers",
    query: {
      enabled: !!contractAddress && contractAddress !== "",
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  return data as bigint | undefined;
};
