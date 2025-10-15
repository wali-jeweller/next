import { db } from "@/db";
import { GoldRatesDashboard } from "./_components/gold-rates-dashboard";

export default async function Page() {
  const rates = await db.query.dailyGoldRates.findMany({
    orderBy: (t, { desc }) => desc(t.date),
    limit: 365, // Get last year's data for better analytics
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        <GoldRatesDashboard rates={rates} />
      </div>
    </div>
  );
}
