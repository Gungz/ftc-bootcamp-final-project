"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { SparklesIcon, UserGroupIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="flex items-center flex-col grow">
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-6xl font-bold mb-4">
              <span className="text-primary">Creator</span> X <span className="text-secondary">Fan</span>
            </h1>
            <p className="text-2xl mb-8">Decentralized Creator Loyalty & Crowdfunding Platform</p>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Build your community, monetize directly, and create sustainable income streams without intermediaries.
              Powered by Aurora Virtual Chain for low-cost micro-interactions.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              {connectedAddress ? (
                <>
                  <Link href="/creator" className="btn btn-primary btn-lg">
                    <SparklesIcon className="h-6 w-6 mr-2" />
                    Create Your Space
                  </Link>
                  <Link href="/explore" className="btn btn-secondary btn-lg">
                    <UserGroupIcon className="h-6 w-6 mr-2" />
                    Explore Creators
                  </Link>
                </>
              ) : (
                <p className="text-lg">Connect your wallet to get started</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-base-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Creator X Fan?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <CurrencyDollarIcon className="h-16 w-16 text-primary mb-4" />
                <h3 className="card-title">Zero Platform Fees</h3>
                <p>Keep 100% of your earnings. Direct creator-to-fan transactions with no intermediaries.</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <UserGroupIcon className="h-16 w-16 text-secondary mb-4" />
                <h3 className="card-title">True Fan Communities</h3>
                <p>Permissioned access via membership NFTs ensures genuine supporters, not bots.</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <SparklesIcon className="h-16 w-16 text-accent mb-4" />
                <h3 className="card-title">Micro-Interactions</h3>
                <p>Low-cost transactions (~$0.02) enable tips, likes, and frequent engagement.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-base-200 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Features</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="p-6 bg-base-100 rounded-lg">
              <h3 className="text-xl font-bold mb-2">🎫 Membership NFTs</h3>
              <p>Set your own pricing and build exclusive communities</p>
            </div>
            <div className="p-6 bg-base-100 rounded-lg">
              <h3 className="text-xl font-bold mb-2">💰 Direct Tipping</h3>
              <p>Fans can tip you directly with on-chain messages</p>
            </div>
            <div className="p-6 bg-base-100 rounded-lg">
              <h3 className="text-xl font-bold mb-2">🎨 Exclusive Content</h3>
              <p>Mint limited edition NFTs for your community</p>
            </div>
            <div className="p-6 bg-base-100 rounded-lg">
              <h3 className="text-xl font-bold mb-2">🚀 Crowdfunding</h3>
              <p>Launch campaigns with flexible funding models</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
