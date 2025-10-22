import type { materialEnum } from "@/db/schema";

export type MaterialKey = (typeof materialEnum)[number];

export interface DummyMarketDefinition {
  id: string;
  name: string;
  code: string;
  currency: string;
  materialRates: Record<MaterialKey, number>;
}

export const DUMMY_MARKETS: DummyMarketDefinition[] = [
  {
    id: "market-in",
    name: "India",
    code: "IN",
    currency: "₹",
    materialRates: {
      gold: 7500,
      silver: 850,
      platinum: 14500,
      pladium: 2600,
      other: 0,
    },
  },
  {
    id: "market-us",
    name: "United States",
    code: "US",
    currency: "$",
    materialRates: {
      gold: 82,
      silver: 1.1,
      platinum: 980,
      pladium: 38,
      other: 0,
    },
  },
  {
    id: "market-ae",
    name: "United Arab Emirates",
    code: "AE",
    currency: "د.إ",
    materialRates: {
      gold: 310,
      silver: 41,
      platinum: 360,
      pladium: 92,
      other: 0,
    },
  },
];
