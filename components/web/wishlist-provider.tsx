"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { useState } from "react";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  slug: string;
}

interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: WishlistItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "LOAD_WISHLIST"; payload: WishlistState }
  | { type: "CLEAR_WISHLIST" };

interface WishlistContextType extends WishlistState {
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (id: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const wishlistReducer = (
  state: WishlistState,
  action: WishlistAction
): WishlistState => {
  switch (action.type) {
    case "ADD_ITEM": {
      // Check if item already exists
      if (state.items.find((item) => item.id === action.payload.id)) {
        return state; // Item already exists, don't add duplicate
      }
      const newItems = [...state.items, action.payload];
      return {
        items: newItems,
        itemCount: newItems.length,
      };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      return {
        items: updatedItems,
        itemCount: updatedItems.length,
      };
    }

    case "CLEAR_WISHLIST":
      return { items: [], itemCount: 0 };

    case "LOAD_WISHLIST":
      return action.payload;

    default:
      return state;
  }
};

const WISHLIST_STORAGE_KEY = "jw-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    itemCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        dispatch({ type: "LOAD_WISHLIST", payload: parsedWishlist });
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error);
    }
  }, [state]);

  const addToWishlist = useCallback(async (item: WishlistItem) => {
    setIsLoading(true);

    // Simulate async operation that resolves on client
    await new Promise((resolve) => setTimeout(resolve, 0));

    dispatch({ type: "ADD_ITEM", payload: item });
    setIsLoading(false);
  }, []);

  const removeFromWishlist = useCallback(async (id: string) => {
    setIsLoading(true);

    // Simulate async operation that resolves on client
    await new Promise((resolve) => setTimeout(resolve, 0));

    dispatch({ type: "REMOVE_ITEM", payload: id });
    setIsLoading(false);
  }, []);

  const clearWishlist = useCallback(async () => {
    setIsLoading(true);

    // Simulate async operation that resolves on client
    await new Promise((resolve) => setTimeout(resolve, 0));

    dispatch({ type: "CLEAR_WISHLIST" });
    setIsLoading(false);
  }, []);

  const isInWishlist = useCallback(
    (id: string) => {
      return state.items.some((item) => item.id === id);
    },
    [state.items]
  );

  const value: WishlistContextType = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    isLoading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
