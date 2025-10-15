"use client";

import { Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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

export function DailyRatesManager({ rates }: { rates: TDailyGoldRate[] }) {
  const [selectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Daily Gold Rates
        </h3>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4" />
                Set Daily Rate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Daily Rate</DialogTitle>
              </DialogHeader>
              <SetRateForm defaultDate={selectedDate} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <RatesHistoryChart rates={rates} />
    </div>
  );
}
