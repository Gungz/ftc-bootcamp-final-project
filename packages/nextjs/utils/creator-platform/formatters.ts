import { formatEther } from "viem";

export const formatPrice = (wei: bigint): string => {
  return formatEther(wei);
};

export const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTimeLeft = (timestamp: number): string => {
  const now = Date.now();
  const diff = timestamp - now;
  
  if (diff <= 0) return "Ended";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
};

export const calculateProgress = (raised: string, goal: string): number => {
  const raisedNum = parseFloat(raised);
  const goalNum = parseFloat(goal);
  return Math.min((raisedNum / goalNum) * 100, 100);
};
