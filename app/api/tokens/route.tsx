import { CoinCodexBaseTokenData } from "@/types/coin-codex.type"
import { NextResponse } from "next/server"

const COINCODEX_API_URL =
  "https://coincodex.com/apps/coincodex/cache/all_coins.json"

export async function GET() {
  try {
    const response = await fetch(COINCODEX_API_URL, {
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 3600,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: Record<string, CoinCodexBaseTokenData> = await response.json()

    const coinsArray: CoinCodexBaseTokenData[] = Object.values(data).map(
      (coin) => ({
        symbol: coin.symbol ?? "",
        display_symbol: coin.display_symbol ?? "",
        name: coin.name ?? "",
        aliases: coin.aliases ?? "",
        shortname: coin.shortname ?? "",
        last_price_usd: Number(coin.last_price_usd) || 0,
        market_cap_rank: Number(coin.market_cap_rank) || 0,
        volume_rank: Number(coin.volume_rank) || 0,
        price_change_1H_percent: Number(coin.price_change_1H_percent) || 0,
        price_change_1D_percent: Number(coin.price_change_1D_percent) || 0,
        price_change_7D_percent: Number(coin.price_change_7D_percent) || 0,
        price_change_30D_percent: Number(coin.price_change_30D_percent) || 0,
        price_change_90D_percent: Number(coin.price_change_90D_percent) || 0,
        price_change_180D_percent: Number(coin.price_change_180D_percent) || 0,
        price_change_365D_percent: Number(coin.price_change_365D_percent) || 0,
        price_change_3Y_percent: Number(coin.price_change_3Y_percent) || 0,
        price_change_5Y_percent: Number(coin.price_change_5Y_percent) || 0,
        price_change_ALL_percent: Number(coin.price_change_ALL_percent) || 0,
        price_change_YTD_percent: Number(coin.price_change_YTD_percent) || 0,
        volume_24_usd: Number(coin.volume_24_usd) || 0,
        display: coin.display ?? "",
        trading_since: coin.trading_since ?? "",
        supply: Number(coin.supply) || 0,
        last_update: coin.last_update ?? "",
        ico_end: coin.ico_end ?? "",
        include_supply: coin.include_supply ?? "",
        use_volume: coin.use_volume ?? "",
        growth_all_time: coin.growth_all_time ?? "",
        ccu_slug: coin.ccu_slug ?? "",
        image_id: coin.image_id ?? "",
        image_t: Number(coin.image_t) || 0,
        market_cap_usd: Number(coin.market_cap_usd) || 0,
        categories: Array.isArray(coin.categories) ? coin.categories : [],
      })
    )

    coinsArray.sort((a, b) => a.market_cap_rank - b.market_cap_rank)

    return NextResponse.json({
      success: true,
      data: coinsArray,
      timestamp: new Date().toISOString(),
      count: coinsArray.length,
    })
  } catch (error) {
    console.error("Error fetching CoinCodex data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch coin data",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
