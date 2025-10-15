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

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  slug?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }
  | { type: "SET_LOADING"; payload: boolean };

interface CartContextType extends CartState {
  addToCart: (
    item: Omit<CartItem, "quantity">,
    quantity?: number
  ) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return calculateCartTotals(updatedItems);
      } else {
        const newItems = [...state.items, action.payload];
        return calculateCartTotals(newItems);
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      return calculateCartTotals(updatedItems);
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0);
      return calculateCartTotals(updatedItems);
    }

    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 };

    case "LOAD_CART":
      return action.payload;

    default:
      return state;
  }
};

const calculateCartTotals = (items: CartItem[]): CartState => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { items, total, itemCount };
};

const CART_STORAGE_KEY = "jw-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: parsedCart });
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [state]);

  const addToCart = useCallback(
    async (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
      setIsLoading(true);

      // Simulate async operation that resolves on client
      await new Promise((resolve) => setTimeout(resolve, 0));

      dispatch({
        type: "ADD_ITEM",
        payload: { ...item, quantity },
      });

      setIsLoading(false);
    },
    []
  );

  const removeFromCart = useCallback(async (id: string) => {
    setIsLoading(true);

    // Simulate async operation that resolves on client
    await new Promise((resolve) => setTimeout(resolve, 0));

    dispatch({ type: "REMOVE_ITEM", payload: id });
    setIsLoading(false);
  }, []);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    setIsLoading(true);

    // Simulate async operation that resolves on client
    await new Promise((resolve) => setTimeout(resolve, 0));

    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    setIsLoading(false);
  }, []);

  const clearCart = useCallback(async () => {
    setIsLoading(true);

    // Simulate async operation that resolves on client
    await new Promise((resolve) => setTimeout(resolve, 0));

    dispatch({ type: "CLEAR_CART" });
    setIsLoading(false);
  }, []);

  const value: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
