import { z } from "zod";

export const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(3).max(50),
  email: z.string().email()
});

export function validateUser(data: unknown) {
  return userSchema.safeParse(data);
}
