// Mock data for development
// TO REPLACE WITH REAL DATA: Remove this file and update components to fetch from blockchain

export const mockCreators = [
  {
    address: "0x1234567890123456789012345678901234567890",
    name: "Digital Artist",
    symbol: "DART",
    membershipPrice: "0.1",
    memberCount: 150,
    totalTips: "5.5",
    description: "Creating digital art and NFT collections",
  },
  {
    address: "0x2345678901234567890123456789012345678901",
    name: "Indie Musician",
    symbol: "MUSIC",
    membershipPrice: "0.05",
    memberCount: 320,
    totalTips: "12.3",
    description: "Independent music producer and songwriter",
  },
  {
    address: "0x3456789012345678901234567890123456789012",
    name: "Tech Writer",
    symbol: "TECH",
    membershipPrice: "0.08",
    memberCount: 89,
    totalTips: "3.2",
    description: "Writing about blockchain and Web3 technology",
  },
];

export const mockContent = [
  {
    id: 0,
    name: "Exclusive Album",
    price: "0.2",
    maxSupply: 100,
    currentSupply: 45,
    uri: "QmExample1",
    type: "audio",
  },
  {
    id: 1,
    name: "Digital Artwork #1",
    price: "0.15",
    maxSupply: 50,
    currentSupply: 30,
    uri: "QmExample2",
    type: "image",
  },
];

export const mockCampaigns = [
  {
    id: 0,
    goal: "10",
    raised: "7.5",
    deadline: Date.now() + 86400000 * 7,
    type: "ALL_OR_NOTHING",
    status: "ACTIVE",
    title: "New Album Production",
  },
  {
    id: 1,
    goal: "5",
    raised: "5.2",
    deadline: Date.now() - 86400000,
    type: "KEEP_WHAT_YOU_RAISE",
    status: "SUCCESS",
    title: "Art Exhibition",
  },
];
