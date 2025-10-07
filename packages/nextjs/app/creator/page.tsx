"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { CreateSpaceForm } from "./_components";

const CreatorPage: NextPage = () => {
  const { address } = useAccount();
  const router = useRouter();

  const handleSpaceCreated = () => {
    router.push("/my-space");
  };

  if (!address) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 text-center">
          <h1 className="text-4xl font-bold mb-4">Create New Space</h1>
          <p className="text-lg">Please connect your wallet to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10 px-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Create New Creator Space</h1>
        <CreateSpaceForm onSuccess={handleSpaceCreated} />
      </div>
    </div>
  );
};

export default CreatorPage;
