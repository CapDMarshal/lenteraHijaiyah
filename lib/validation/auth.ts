import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal harus 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal harus 8 karakter"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(10, "Token tidak valid"),
  password: z.string().min(8, "Password minimal harus 8 karakter"),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
