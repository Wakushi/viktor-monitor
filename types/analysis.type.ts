export type ContractAddress = {
  decimal_place: number
  contract_address: string
}

export type TokenMetadata = {
  id: string
  symbol: string
  name: string
  contract_addresses: {
    [chain: string]: ContractAddress
  }
  market_cap_rank: number
  genesis_date: string | null
  categories: string[]
  links: {
    github: string[]
    twitter: string
    website: string[]
    telegram: string
  }
  platforms: {
    [chain: string]: string
  }
  last_updated: string
  created_at: string
}

export type TokenMarket = {
  coin_gecko_id: string
  timestamp: number
  created_at: string
  market_cap_rank: number
  price_usd: number
  high_24h: number
  low_24h: number
  ath: number
  ath_change_percentage: number
  atl: number
  total_volume: number
  atl_change_percentage: number
  market_cap: number
  fully_diluted_valuation: number
  circulating_supply: number
  total_supply: number
  max_supply: number | null
  supply_ratio: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
}

export type Token = {
  market: TokenMarket
  metadata: TokenMetadata
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
  token: Token
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

export type Analyse = {
  id: number
  created_at: string
  analysis: Analysis
}
