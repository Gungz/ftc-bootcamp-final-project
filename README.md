# 🎨 Creator X Fan Platform

A decentralized creator loyalty & crowdfunding platform built on Aurora Virtual Chain, enabling creators to monetize their content through memberships, exclusive NFTs, and crowdfunding campaigns.

## 🌟 Features

- **Creator Spaces**: Creators can launch unlimited spaces with custom branding
- **Membership NFTs**: ERC721 tokens with creator-set pricing and zero platform fees but virtual chain gas fee 
- **Exclusive Content**: ERC1155 limited edition content NFTs with IPFS storage
- **Crowdfunding Campaigns**: Both all-or-nothing and keep-what-you-raise models
- **Social Features**: Tips, likes, and polls for community engagement
- **IPFS Integration**: Decentralized content storage via Pinata

## 🛠 Tech Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS, DaisyUI
- **Smart Contracts**: Solidity 0.8.20, Hardhat
- **Web3**: Wagmi, Viem, RainbowKit
- **Storage**: IPFS via Pinata SDK
- **Network**: Aurora Virtual Chain (custom gas token: GUNG)

## 📋 Requirements

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- Pinata account for IPFS storage

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd ftc-bootcamp-final-project
yarn install
```

### 2. Environment Setup

Create `.env` files in both `packages/hardhat` and `packages/nextjs`:

**packages/nextjs/.env.local**:
```
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token
```

### 3. Start Local Development

**Terminal 1** - Start local blockchain:
```bash
yarn chain
```

**Terminal 2** - Deploy contracts:
```bash
yarn deploy
```

**Terminal 3** - Start frontend:
```bash
yarn start
```

Open http://localhost:3000

## 📁 Project Structure

```
packages/
├── hardhat/
│   └── contracts/
│       ├── CreatorPlatform.sol      # Factory contract
│       ├── CreatorSpace.sol         # Space management
│       ├── MembershipNFT.sol        # ERC721 memberships
│       ├── ExclusiveContent.sol     # ERC1155 content
│       └── CrowdfundingCampaign.sol # Funding campaigns
└── nextjs/
    ├── app/
    │   ├── creator/                 # Create space
    │   ├── my-space/                # Manage spaces
    │   ├── space/[address]/         # Public space view
    │   └── explore/                 # Browse spaces
    └── hooks/creator-platform/      # Custom Web3 hooks
```

## 🎯 Core Contracts

- **CreatorPlatform**: Factory deploying creator spaces
- **CreatorSpace**: Tips, likes, polls management
- **MembershipNFT**: ERC721 with creator-set pricing
- **ExclusiveContent**: ERC1155 limited edition NFTs
- **CrowdfundingCampaign**: Flexible funding models

## 🔧 Key Features Implementation

### Creating a Space
1. Navigate to `/creator`
2. Fill in space details
3. Contract deploys MembershipNFT, ExclusiveContent, and CrowdfundingCampaign
4. Redirects to `/my-space` for management

### Managing Content
1. Upload file to IPFS via Pinata
2. Set price and max supply
3. Creates ERC1155 token on-chain
4. Members can mint and access content

### Member Benefits
- Access exclusive content
- Tip creators directly
- Like and engage with space
- Participate in polls
- Download/view minted content

## 🌐 Deployment

See [packages/nextjs/README.md](./packages/nextjs/README.md) for detailed deployment instructions.

## 📚 Documentation

- [Scaffold-ETH 2 Docs](https://docs.scaffoldeth.io)
- [Aurora Virtual Chain](https://aurora.dev)
- [Pinata IPFS](https://pinata.cloud)

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.
