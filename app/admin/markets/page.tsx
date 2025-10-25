import { MarketsHeader } from "./_components/header";
import { MarketsTable } from "./_components/table";
import { db } from "@/db";
import { markets, materialRates } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import type { MarketWithRates } from "./_components/columns";

export default async function Page() {
  const marketsData = await db
    .select()
    .from(markets)
    .leftJoin(materialRates, eq(markets.id, materialRates.marketId))
    .orderBy(desc(markets.createdAt));

  // Group material rates by market
  const marketsMap = new Map<string, MarketWithRates>();

  for (const row of marketsData) {
    const market = row.markets;
    const rate = row.material_rates;

    if (!marketsMap.has(market.id)) {
      marketsMap.set(market.id, {
        ...market,
        materialRates: [],
      });
    }

    if (rate) {
      marketsMap.get(market.id)!.materialRates!.push(rate);
    }
  }

  const marketsWithRates = Array.from(marketsMap.values());

  return (
    <div className="p-4">
      <MarketsHeader />
      <MarketsTable data={marketsWithRates} />
    </div>
  );
}
