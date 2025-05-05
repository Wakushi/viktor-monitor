import { MobulaChain } from "@/types/week-analysis.type"
import { Address, Hex } from "viem"

export function getBlockExplorerUrl(
  chain: MobulaChain,
  address: Address | string
) {
  const explorerUrls: Record<string, string> = {
    [MobulaChain.ETHEREUM]: "https://etherscan.io/address/",
    [MobulaChain.BASE]: "https://basescan.org/address/",
    [MobulaChain.SOLANA]: "https://solscan.io/account/",
    [MobulaChain.ARBITRUM]: "https://arbiscan.io/address/",
  }

  return explorerUrls[chain] + address
}

export function getBlockExplorerTxUrl(
  chain: MobulaChain,
  txHash: Hex | string
) {
  const explorerUrls: Record<string, string> = {
    [MobulaChain.ETHEREUM]: "https://etherscan.io/tx/",
    [MobulaChain.BASE]: "https://basescan.org/tx/",
    [MobulaChain.SOLANA]: "https://solscan.io/tx/",
    [MobulaChain.ARBITRUM]: "https://arbiscan.io/tx/",
  }

  return explorerUrls[chain] + txHash
}
