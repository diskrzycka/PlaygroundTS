import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3).max(50),
  email: z.string().email()
});

export const updateUserSchema = userSchema.partial().omit({ id: true });

export function validateUser(data: unknown) {
  return userSchema.safeParse(data);
}

export function validateUserUpdate(data: unknown) {
  return updateUserSchema.safeParse(data);
}
