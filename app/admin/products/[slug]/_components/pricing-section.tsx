"use client";

import * as React from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { ProductFormValues, MarketPricingFormValue } from "./types";
import type { DummyMarketDefinition } from "./pricing-data";

interface PricingSectionProps {
  markets: DummyMarketDefinition[];
}

const formatMoney = (currency: string, value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return `${currency}0`;
  }

  const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
  return `${currency}${rounded.toLocaleString(undefined, {
    minimumFractionDigits: rounded % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

export function PricingSection({ markets }: PricingSectionProps) {
  const { control } = useFormContext<ProductFormValues>();
  const { fields, replace, update } = useFieldArray({
    control,
    name: "marketPricing",
  });

  React.useEffect(() => {
    if (!fields.length) {
      replace(
        markets.map((market) => ({
          marketId: market.id,
          marketName: market.name,
          currency: market.currency,
          basePrice: null,
          makingCharges: 0,
          discountPercentage: 0,
        }))
      );
    }
  }, [fields.length, markets, replace]);

  const [activeMarketId, setActiveMarketId] = React.useState(
    markets[0]?.id ?? ""
  );

  React.useEffect(() => {
    if (!activeMarketId && markets.length) {
      setActiveMarketId(markets[0]?.id ?? "");
    }
  }, [activeMarketId, markets]);

  const weight = useWatch({ control, name: "weight" });
  const material = useWatch({ control, name: "material" });

  const patchMarketPricing = React.useCallback(
    (index: number, changes: Partial<MarketPricingFormValue>) => {
      const current = fields[index] as
        | (MarketPricingFormValue & { id?: string })
        | undefined;
      if (!current) {
        return;
      }

      update(index, {
        marketId: current.marketId,
        marketName: current.marketName,
        currency: current.currency,
        basePrice:
          changes.basePrice !== undefined
            ? changes.basePrice
            : current.basePrice,
        makingCharges:
          changes.makingCharges !== undefined
            ? changes.makingCharges
            : current.makingCharges,
        discountPercentage:
          changes.discountPercentage !== undefined
            ? changes.discountPercentage
            : current.discountPercentage,
      });
    },
    [fields, update]
  );

  const applyPricingToAll = React.useCallback(
    (template: MarketPricingFormValue) => {
      fields.forEach((_, index) => {
        patchMarketPricing(index, {
          basePrice: template.basePrice,
          makingCharges: template.makingCharges,
          discountPercentage: template.discountPercentage,
        });
      });
    },
    [fields, patchMarketPricing]
  );

  const marketEntries = React.useMemo(() => {
    return markets.map((market) => {
      const index = fields.findIndex((field) => field.marketId === market.id);
      const entry =
        index >= 0
          ? (fields[index] as MarketPricingFormValue & { id?: string })
          : {
              marketId: market.id,
              marketName: market.name,
              currency: market.currency,
              basePrice: null,
              makingCharges: 0,
              discountPercentage: 0,
            };

      const ratePerGram = material
        ? market.materialRates[
            material as keyof DummyMarketDefinition["materialRates"]
          ] || 0
        : 0;

      const safeWeight =
        typeof weight === "number" ? weight : Number(weight ?? 0);
      const materialCost = safeWeight > 0 ? ratePerGram * safeWeight : 0;
      const basePrice = entry.basePrice ?? materialCost;
      const makingCharges = entry.makingCharges ?? 0;
      const subtotal = basePrice + makingCharges;
      const discountPercentage = entry.discountPercentage ?? 0;
      const discountAmount = subtotal * (discountPercentage / 100);
      const finalPrice = Math.max(subtotal - discountAmount, 0);

      return {
        market,
        entry,
        index,
        ratePerGram,
        materialCost,
        basePrice,
        makingCharges,
        discountPercentage,
        discountAmount,
        finalPrice,
      };
    });
  }, [fields, markets, material, weight]);

  const readyForPricing = Boolean(
    material && material !== "other" && typeof weight === "number" && weight > 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Pricing</CardTitle>
        <CardDescription>
          Suggested prices are calculated from the selected material and weight.
          Override per market when needed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!readyForPricing && (
          <div className="rounded-lg border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
            Select both a material and weight to unlock precise pricing
            suggestions.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {marketEntries.map(
            ({ market, index, materialCost, finalPrice, ratePerGram }) => (
              <div
                key={market.id}
                className="flex h-full flex-col justify-between rounded-xl border bg-card/60 p-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">
                        {market.code}
                      </p>
                      <p className="text-lg font-semibold">{market.name}</p>
                    </div>
                    <Badge variant="secondary">{market.currency}</Badge>
                  </div>

                  <Separator className="my-2" />

                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Material rate</span>
                      <span>
                        {formatMoney(market.currency, ratePerGram)} /g
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Material cost</span>
                      <span>{formatMoney(market.currency, materialCost)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Projected price</span>
                      <span className="text-base font-semibold text-emerald-600">
                        {formatMoney(market.currency, finalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setActiveMarketId(market.id)}
                  >
                    Edit pricing
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={!readyForPricing || index < 0}
                    onClick={() =>
                      patchMarketPricing(index, {
                        basePrice: readyForPricing ? materialCost : null,
                      })
                    }
                  >
                    Use material cost
                  </Button>
                </div>
              </div>
            )
          )}
        </div>

        <Tabs
          value={activeMarketId || markets[0]?.id}
          onValueChange={setActiveMarketId}
          className="space-y-4"
        >
          <TabsList className="grid w-full gap-2 md:grid-cols-3">
            {markets.map((market) => (
              <TabsTrigger key={market.id} value={market.id}>
                {market.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {marketEntries.map(
            ({
              market,
              entry,
              index,
              materialCost,
              basePrice,
              makingCharges,
              discountPercentage,
              discountAmount,
              finalPrice,
            }) => {
              if (index < 0) {
                return null;
              }

              return (
                <TabsContent
                  key={market.id}
                  value={market.id}
                  className="space-y-6"
                >
                  <div className="rounded-xl border bg-muted/30 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Price breakdown
                        </p>
                        <p className="text-2xl font-semibold">
                          {formatMoney(market.currency, finalPrice)}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center justify-between gap-6">
                          <span>Material cost</span>
                          <span>
                            {formatMoney(market.currency, materialCost)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-6">
                          <span>Base price</span>
                          <span>{formatMoney(market.currency, basePrice)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-6">
                          <span>Making charges</span>
                          <span>
                            {formatMoney(market.currency, makingCharges)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-6">
                          <span>Discount</span>
                          <span>
                            {formatMoney(market.currency, discountAmount)} (
                            {discountPercentage}% )
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <FieldGroup className="grid gap-6 sm:grid-cols-3">
                    <Field>
                      <FieldLabel htmlFor={`base-price-${market.id}`}>
                        Base price override
                      </FieldLabel>
                      <Controller
                        control={control}
                        name={`marketPricing.${index}.basePrice` as const}
                        render={({ field }) => (
                          <Input
                            id={`base-price-${market.id}`}
                            type="number"
                            min="0"
                            placeholder={
                              materialCost ? materialCost.toFixed(2) : "0"
                            }
                            value={field.value ?? ""}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              field.onChange(
                                nextValue ? Number(nextValue) : null
                              );
                            }}
                          />
                        )}
                      />
                      <FieldDescription>
                        Leave empty to use the calculated material cost as the
                        base price.
                      </FieldDescription>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor={`making-charges-${market.id}`}>
                        Making charges (flat)
                      </FieldLabel>
                      <Controller
                        control={control}
                        name={`marketPricing.${index}.makingCharges` as const}
                        render={({ field }) => (
                          <Input
                            id={`making-charges-${market.id}`}
                            type="number"
                            min="0"
                            value={field.value ?? 0}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              field.onChange(nextValue ? Number(nextValue) : 0);
                            }}
                          />
                        )}
                      />
                      <FieldDescription>
                        A flat amount added after material cost.
                      </FieldDescription>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor={`discount-${market.id}`}>
                        Discount %
                      </FieldLabel>
                      <Controller
                        control={control}
                        name={
                          `marketPricing.${index}.discountPercentage` as const
                        }
                        render={({ field }) => (
                          <Input
                            id={`discount-${market.id}`}
                            type="number"
                            min="0"
                            max="100"
                            value={field.value ?? 0}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              const numericValue = nextValue
                                ? Number(nextValue)
                                : 0;
                              field.onChange(
                                Math.min(Math.max(numericValue, 0), 100)
                              );
                            }}
                          />
                        )}
                      />
                      <FieldDescription>
                        Percentage discount applied to the subtotal.
                      </FieldDescription>
                    </Field>
                  </FieldGroup>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={index < 0}
                      onClick={() =>
                        patchMarketPricing(index, {
                          basePrice: null,
                          makingCharges: 0,
                          discountPercentage: 0,
                        })
                      }
                    >
                      Reset overrides
                    </Button>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!readyForPricing || index < 0}
                        onClick={() =>
                          patchMarketPricing(index, {
                            basePrice: readyForPricing ? materialCost : null,
                          })
                        }
                      >
                        Use material calculation
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={index < 0}
                        onClick={() =>
                          applyPricingToAll({
                            marketId: entry.marketId,
                            marketName: entry.marketName,
                            currency: entry.currency,
                            basePrice: entry.basePrice,
                            makingCharges: entry.makingCharges,
                            discountPercentage: entry.discountPercentage,
                          })
                        }
                      >
                        Mirror to all markets
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              );
            }
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
