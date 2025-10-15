"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon, TrendingUp, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import type { TDailyGoldRate } from "@/db/schema";
import { cn } from "@/lib/utils";
import { setDailyRateAction } from "../actions";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  rate: z.string().min(1, "Rate is required"),
});

type FormData = z.infer<typeof formSchema>;

export function SetRateForm({
  onSuccess,
  defaultDate,
}: {
  onSuccess?: (createdOrUpdated: TDailyGoldRate | null) => void;
  defaultDate: string;
}) {
  // const formatLocalYmd = (date: Date): string => {
  //   const y = date.getFullYear();
  //   const m = String(date.getMonth() + 1).padStart(2, "0");
  //   const d = String(date.getDate()).padStart(2, "0");
  //   return `${y}-${m}-${d}`;
  // };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: defaultDate,
      rate: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const numericRate = parseFloat(data.rate);
    if (isNaN(numericRate) || numericRate <= 0) {
      toast.error("Please enter a valid rate");
      return;
    }

    try {
      const result = await setDailyRateAction({
        date: data.date,
        ratePerGram: numericRate,
      });

      if (result.success) {
        toast.success("Rate updated successfully");
        form.reset({
          date: defaultDate,
          rate: "",
        });
        onSuccess?.(null);
      } else {
        toast.error(result.error || "Failed to update rate");
      }
    } catch {
      toast.error("Failed to update rate");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Rate Info */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Quick Reference</span>
          </div>
          <p className="text-lg font-bold">₨ 21,450 - 21,500</p>
          <p className="text-xs text-muted-foreground">Typical market range</p>
        </div>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Date
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal h-11",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        new Date(field.value).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Rate per Gram (PKR)
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    ₨
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    placeholder="21,500.00"
                    className="pl-8 h-11"
                    {...field}
                  />
                </div>
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Enter the gold rate per gram in Pakistani Rupees
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full h-11"
            disabled={!form.formState.isValid}
          >
            {form.formState.isSubmitting ? "Setting Rate..." : "Set Gold Rate"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
