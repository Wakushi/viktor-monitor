import { Address } from "viem"

export type WeekAnalysisRecord = {
  id: number
  created_at: string
  analysis: WeekAnalysis
  performance?: TokenPerformance[]
  fear_and_greed_index?: string
}

export type WeekAnalysis = {
  formattedResults: FormattedResult[]
  results: TokenWeekAnalysisResult[]
}

export type FormattedResult = {
  token: string
  price: string
  buyingConfidence: string
}

export type TokenWeekAnalysisResult = {
  token: MobulaExtendedToken
  prediction: "bullish" | "bearish"
  confidence: number
  forecastDistribution: ForecastDistribution
  expectedNextDayChange: number
  similarConditions: SimilarWeekObservation[]
  tokenOHLCV: DailyOHLCV[]
  observation: string
}

export interface MobulaMultiDataToken {
  id?: number
  key: string
  token_id: number
  timestamp?: number
  name: string
  symbol: string
  decimals: number
  logo: string
  rank: number
  price: number
  market_cap: number
  market_cap_diluted: number
  volume: number
  volume_change_24h: number
  volume_7d: number
  liquidity: number
  ath: number
  atl: number
  off_chain_volume: number
  is_listed: boolean
  price_change_1h: number
  price_change_24h: number
  price_change_7d: number
  price_change_1m: number
  price_change_1y: number
  total_supply: number
  circulating_supply: number
  contracts: TokenContract[]
}

export interface MobulaTokenSocials {
  twitter?: string
  website?: string
}

export interface TokenContract {
  address: Address | string
  blockchainId: string
  blockchain: MobulaChain
  decimals: number
}

export interface MobulaExtendedToken extends MobulaMultiDataToken {
  extra?: MobulaTokenSocials
}

export type ForecastDistribution = {
  bullish: number
  bearish: number
}

export type WeekObservation = {
  id: string
  token_name: string
  start_date: string
  end_date: string
  observation_text: string
  embedding?: number[]
  raw_ohlcv_window: string // JSON.stringify(DailyOHLCV[])
  next_day_close: number
  next_day_change: number
  outcome: "bullish" | "bearish" | "neutral" | null
  created_at: string
}

export type SimilarWeekObservation = WeekObservation & {
  similarity: number
}

export interface DailyOHLCV {
  Start: string
  End: string
  Open: number
  High: number
  Low: number
  Close: number
  Volume: number
  "Market Cap": number
}

export enum MobulaChain {
  ETHEREUM = "Ethereum",
  BASE = "Base",
  SOLANA = "Solana",
}

export type TokenPerformance = {
  token: string
  initialPrice: number
  currentPrice: number
  priceChange: number
  percentageChange: number
}
