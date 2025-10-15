"use client";

import { Plus, TrendingUp, Calendar, DollarSign, Target } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { TDailyGoldRate } from "@/db/schema";
import { RatesHistoryChart } from "./rates-history-chart";
import { SetRateForm } from "./set-rate-form";
import { formatPrice } from "@/lib/format-price";

export function GoldRatesDashboard({ rates }: { rates: TDailyGoldRate[] }) {
  const [selectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Calculate statistics
  const currentRate = rates[0]?.ratePerGram || 0;
  const previousRate = rates[1]?.ratePerGram || 0;
  const change = currentRate - previousRate;
  const changePercentage = previousRate > 0 ? (change / previousRate) * 100 : 0;

  // Calculate min/max rates
  const allRates = rates.map((r) => r.ratePerGram);
  const maxRate = Math.max(...allRates);

  // Calculate average rate
  const avgRate =
    allRates.length > 0
      ? allRates.reduce((a, b) => a + b, 0) / allRates.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Gold Rates Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage daily gold rates with comprehensive analytics
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Set New Rate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Set Daily Gold Rate</DialogTitle>
            </DialogHeader>
            <SetRateForm
              defaultDate={selectedDate}
              onSuccess={() => window.location.reload()}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(currentRate)}</div>
            <p className="text-xs text-muted-foreground">Per gram</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Change</CardTitle>
            <TrendingUp
              className={`h-4 w-4 ${
                change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change >= 0 ? "+" : ""}
              {formatPrice(change)}
            </div>
            <p className="text-xs text-muted-foreground">
              {changePercentage >= 0 ? "+" : ""}
              {changePercentage.toFixed(2)}% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(maxRate)}</div>
            <p className="text-xs text-muted-foreground">Peak rate recorded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(avgRate)}</div>
            <p className="text-xs text-muted-foreground">
              Over {rates.length} days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <RatesHistoryChart rates={rates} />

      {/* Recent Rates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Rates</CardTitle>
          <CardDescription>
            Latest {Math.min(10, rates.length)} rate updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {rates.slice(0, 10).map((rate, index) => (
              <div
                key={rate.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div>
                    <p className="font-medium">
                      {formatPrice(rate.ratePerGram)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(rate.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {index === 0
                      ? "Current"
                      : `${index + 1} day${index > 0 ? "s" : ""} ago`}
                  </p>
                  {index > 0 && (
                    <p
                      className={`text-xs ${
                        rate.ratePerGram >= rates[index - 1].ratePerGram
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {rate.ratePerGram >= rates[index - 1].ratePerGram
                        ? "↗"
                        : "↘"}
                      {Math.abs(
                        ((rate.ratePerGram - rates[index - 1].ratePerGram) /
                          rates[index - 1].ratePerGram) *
                          100
                      ).toFixed(1)}
                      %
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
