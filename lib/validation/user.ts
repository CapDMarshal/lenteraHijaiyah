import { z } from "zod";

export const profileUpdateSchema = z
  .object({
    name: z.string().min(2, "Nama minimal harus 2 karakter").optional(),
    email: z.string().email("Format email tidak valid").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Minimal satu field harus diisi",
  });

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: z.string().min(8, "Password baru minimal harus 8 karakter"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Password baru tidak boleh sama dengan password saat ini",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
