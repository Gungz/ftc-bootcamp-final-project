import { useReadContract } from "wagmi";
import CreatorSpaceAbi from "~~/contracts/CreatorSpace.json";

export const useCreatorSpaceData = (spaceAddress: string) => {
  const { data: creator } = useReadContract({
    address: spaceAddress as `0x${string}`,
    abi: CreatorSpaceAbi,
    functionName: "creator",
    query: {
      enabled: !!spaceAddress && spaceAddress !== "0x0000000000000000000000000000000000000000",
    },
  });

  const { data: membershipNFT } = useReadContract({
    address: spaceAddress as `0x${string}`,
    abi: CreatorSpaceAbi,
    functionName: "membershipNFT",
    query: {
      enabled: !!spaceAddress && spaceAddress !== "0x0000000000000000000000000000000000000000",
    },
  });

  const { data: exclusiveContent } = useReadContract({
    address: spaceAddress as `0x${string}`,
    abi: CreatorSpaceAbi,
    functionName: "exclusiveContent",
    query: {
      enabled: !!spaceAddress && spaceAddress !== "0x0000000000000000000000000000000000000000",
    },
  });

  const { data: crowdfunding } = useReadContract({
    address: spaceAddress as `0x${string}`,
    abi: CreatorSpaceAbi,
    functionName: "crowdfunding",
    query: {
      enabled: !!spaceAddress && spaceAddress !== "0x0000000000000000000000000000000000000000",
    },
  });

  const { data: description } = useReadContract({
    address: spaceAddress as `0x${string}`,
    abi: CreatorSpaceAbi,
    functionName: "description",
    query: {
      enabled: !!spaceAddress && spaceAddress !== "0x0000000000000000000000000000000000000000",
    },
  });

  /*console.log("useCreatorSpaceData:", {
    creator,
    membershipNFT,
    exclusiveContent,
    crowdfunding,
    description,
  });*/
  
  if (!membershipNFT || !exclusiveContent || !crowdfunding || !creator) {
    return null;
  }

  return {
    membershipNFT: membershipNFT as string,
    exclusiveContent: exclusiveContent as string,
    crowdfunding: crowdfunding as string,
    creator: creator as string,
    description: description as string,
  };
};
