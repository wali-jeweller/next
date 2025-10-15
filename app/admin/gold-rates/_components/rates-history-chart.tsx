"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { TDailyGoldRate } from "@/db/schema";
import { formatPrice } from "@/lib/format-price";
import { TrendingUp, TrendingDown } from "lucide-react";

export function RatesHistoryChart({ rates }: { rates: TDailyGoldRate[] }) {
  // Group rates by date and get the last rate set for each date
  const ratesByDate = rates.reduce((acc, rate) => {
    const dateKey = new Date(rate.createdAt).toISOString().split("T")[0];

    // If no rate exists for this date, or if this rate is newer, use this rate
    if (!acc[dateKey] || rate.createdAt > acc[dateKey].createdAt) {
      acc[dateKey] = rate;
    }

    return acc;
  }, {} as Record<string, TDailyGoldRate>);

  // Convert to chart data format and sort by date
  const chartData = Object.values(ratesByDate)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map((rate) => ({
      date: new Date(rate.createdAt).toISOString().split("T")[0],
      rate: rate.ratePerGram,
    }));

  // Calculate trend
  const currentRate = chartData[chartData.length - 1]?.rate || 0;
  const previousRate = chartData[chartData.length - 2]?.rate || 0;
  const trend = currentRate - previousRate;
  const trendPercentage = previousRate > 0 ? (trend / previousRate) * 100 : 0;

  const chartConfig = {
    rate: {
      label: "Gold Rate per Gram",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Gold Rate Trends</CardTitle>
          <CardDescription>
            Daily gold rates over time • {chartData.length} data points
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">Current Rate</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {formatPrice(currentRate)}
            </span>
          </div>
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">Trend</span>
            <span
              className={`text-lg font-bold leading-none sm:text-3xl flex items-center gap-1 ${
                trend >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {trendPercentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatPrice(value)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  nameKey="rate"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  formatter={(value) => [
                    formatPrice(Number(value)),
                    "Rate per gram",
                  ]}
                />
              }
            />
            <Line
              dataKey="rate"
              stroke="var(--color-rate)"
              strokeWidth={2}
              dot={{ fill: "var(--color-rate)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "var(--color-rate)", strokeWidth: 2 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
