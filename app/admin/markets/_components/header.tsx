"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { MarketFormDialog } from "./market-form-dialog";
import { createMarketAction, type CreateMarketInput } from "../actions";
import { toast } from "sonner";

export function MarketsHeader() {
  const [open, setOpen] = useState(false);

  const handleCreateMarket = async (data: CreateMarketInput) => {
    const result = await createMarketAction(data);

    if (result.success) {
      toast.success("Market created successfully");
      setOpen(false);
    } else {
      toast.error(result.error || "Failed to create market");
    }
  };

  return (
    <>
      <header className="flex items-center justify-between pb-4">
        <div className="flex gap-2 items-center">
          <Globe className="size-5" />
          <h1 className="text-2xl font-medium">Markets</h1>
        </div>
        <Button onClick={() => setOpen(true)}>Create Market</Button>
      </header>

      <MarketFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreateMarket}
      />
    </>
  );
}
