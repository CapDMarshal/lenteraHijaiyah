import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal harus 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal harus 8 karakter"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
