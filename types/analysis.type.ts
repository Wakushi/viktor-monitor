export type Contract = {
  address: string
  blockchainId: string
  blockchain: string
  decimals: number
}

export type TokenMarketObservation = {
  key: string
  id: number
  name: string
  symbol: string
  decimals: number
  logo: string
  rank: number | null
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
  contracts: Contract[]
  timestamp: number
  extra?: MobulaTokenSocials
}

export interface MobulaTokenSocials {
  twitter?: string
  website?: string
}

export type BuyingConfidenceMetrics = {
  decisionTypeScore: number
  similarityScore: number
  profitabilityScore: number
  volatilityAdjustment: number
  sampleSizeConfidence: number
}

export type BuyingConfidence = {
  score: number
  sampleSizeConfidence: number
  metrics: BuyingConfidenceMetrics
}

export type DecisionTypeRatio = {
  buyCount: number
  sellCount: number
  profitableBuyCount: number
  profitableSellCount: number
  averageProfitPercent: number
}

export type TokenAnalysis = {
  token: TokenMarketObservation
  textObservation: string
  buyingConfidence: BuyingConfidence
  similarDecisionsAmount: number
  decisionTypeRatio: DecisionTypeRatio
}

export type FormattedResult = {
  token: string
  price: string
  buyingConfidence: string
}

export type Analysis = {
  formattedResults: FormattedResult[]
  analysis: TokenAnalysis[]
}

export type TokenPerformance = {
  token: string
  initialPrice: number
  currentPrice: number
  priceChange: number
  percentageChange: number
}

export type Analyse = {
  id: number
  created_at: string
  analysis: Analysis
  performance?: TokenPerformance[]
  fear_and_greed_index?: string
}
