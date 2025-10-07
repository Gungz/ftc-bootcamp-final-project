import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const useCreatorPlatform = () => {
  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "CreatorPlatform" });

  const createCreatorSpace = async (name: string, symbol: string, description: string, price: bigint) => {
    return await writeContractAsync({
      functionName: "createCreatorSpace",
      args: [name, symbol, description, price],
    });
  };

  return {
    createCreatorSpace,
  };
};

export const useGetCreatorSpaces = (creator: string) => {
  const { data } = useScaffoldReadContract({
    contractName: "CreatorPlatform",
    functionName: "getCreatorSpaces",
    args: [creator],
    watch: true,
  });

  return (data as string[]) || [];
};

export const useGetAllCreatorSpaces = () => {
  const { data } = useScaffoldReadContract({
    contractName: "CreatorPlatform",
    functionName: "getAllCreatorSpaces",
    watch: true,
  });

  return (data as string[]) || [];
};
