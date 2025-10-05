# Decentralized Creator Loyalty & Crowdfunding Platform - Smart Contracts

## Overview

A platform for creators to build, manage, and monetize their fan communities with permissioned access, tipping, crowdfunding, and exclusive content.

## Contracts

### CreatorPlatform.sol
Factory contract that deploys and tracks all creator spaces.

**Key Functions:**
- `createCreatorSpace(name, symbol, price)` - Deploy a new creator space
- `getCreatorSpaces(creator)` - Get all spaces for a creator
- `getAllCreatorSpaces()` - Get all spaces on platform

### CreatorSpace.sol
Main contract for each creator's economy. Manages membership, tipping, polls, and integrates other contracts.

**Key Functions:**
- `tip(message)` - Send ETH tip to creator (members only)
- `like()` - Like creator's content (members only)
- `createPoll(question, options, duration)` - Create a poll (creator only)
- `vote(pollId, optionIndex)` - Vote on a poll (members only)

**Integrated Contracts:**
- MembershipNFT
- ExclusiveContent
- CrowdfundingCampaign

### MembershipNFT.sol
ERC721 token for permissioned access to creator space.

**Key Functions:**
- `mintMembership()` - Purchase membership NFT
- `setMembershipPrice(price)` - Update price (creator only)
- `isMember(address)` - Check if address is a member
- `withdraw()` - Withdraw membership sales (creator only)

### ExclusiveContent.sol
ERC1155 token for limited edition digital collectibles.

**Key Functions:**
- `createContent(price, maxSupply, uri)` - Create new content (creator only)
- `mintContent(contentId, amount)` - Purchase content NFT
- `withdraw()` - Withdraw sales (creator only)

### CrowdfundingCampaign.sol
Manages crowdfunding campaigns with two models: all-or-nothing and keep-what-you-raise.

**Key Functions:**
- `createCampaign(goal, duration, type)` - Start campaign (creator only)
- `contribute(campaignId)` - Contribute to campaign
- `finalizeCampaign(campaignId)` - Finalize after deadline
- `withdrawFunds(campaignId)` - Withdraw if successful (creator only)
- `refund(campaignId)` - Get refund if failed (all-or-nothing only)

## Deployment

```bash
# Deploy all contracts
yarn deploy

# Deploy to specific network
yarn deploy --network sepolia
```

## Testing

```bash
# Run tests
yarn hardhat:test

# Run with gas reporting
REPORT_GAS=true yarn hardhat:test
```

## Usage Flow

1. **Creator Setup:**
   ```solidity
   // Deploy creator space via platform
   creatorPlatform.createCreatorSpace("My Space", "MSP", 0.1 ether);
   ```

2. **Fan Joins:**
   ```solidity
   // Purchase membership
   membershipNFT.mintMembership{value: 0.1 ether}();
   ```

3. **Fan Engagement:**
   ```solidity
   // Tip creator
   creatorSpace.tip("Love your work!"){value: 0.05 ether}();
   
   // Like content
   creatorSpace.like();
   
   // Vote in poll
   creatorSpace.vote(pollId, optionIndex);
   
   // Mint exclusive content
   exclusiveContent.mintContent(contentId, 1){value: price}();
   
   // Support crowdfunding
   crowdfunding.contribute(campaignId){value: 1 ether}();
   ```

## Security Features

- ReentrancyGuard on all payable functions
- Access control (onlyCreator, onlyMember modifiers)
- Pull over push for payments
- OpenZeppelin battle-tested contracts

## Gas Optimization

- Efficient struct packing
- Events over storage for historical data
- Minimal storage writes
- Optimized for Aurora Virtual Chain (~$0.02 per transaction)

## Aurora Virtual Chain Integration

These contracts are EVM-compatible and work seamlessly with Aurora Virtual Chain's custom gas token. No special modifications needed - fans use the virtual chain token for all transactions.
