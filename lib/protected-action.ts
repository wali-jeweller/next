/* eslint-disable @typescript-eslint/no-explicit-any */
import type { z } from "zod";
import { auth } from "./auth";

type ProtectedAction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>
) => Promise<T>;

export function protectedAction<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ProtectedAction<S, T>
) {
  return async (data: z.infer<S>): Promise<T> => {
    const result = schema.safeParse(data);
    const { user, session } = await auth();

    if (!user || !session) {
      throw new Error("Unauthorized");
    }

    if (!result.success) {
      return { error: result.error.issues[0].message } as T;
    }

    return action(result.data);
  };
}
