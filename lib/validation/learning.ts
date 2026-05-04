import { z } from "zod";

export const progressUpdateSchema = z.object({
  moduleId: z.string().uuid("Format moduleId tidak valid"),
  isCompleted: z.boolean(),
});

export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>;

export const moduleCreateSchema = z.object({
  title: z.string().min(2, "Judul minimal 2 karakter"),
  content: z.string().min(1, "Konten wajib diisi"),
  pdfKey: z.string().min(1, "PDF key wajib diisi"),
  categoryId: z.string().uuid("Format categoryId tidak valid"),
});

export type ModuleCreateInput = z.infer<typeof moduleCreateSchema>;

export const moduleUpdateSchema = z
  .object({
    title: z.string().min(2, "Judul minimal 2 karakter").optional(),
    content: z.string().min(1, "Konten wajib diisi").optional(),
    pdfKey: z.string().min(1, "PDF key wajib diisi").optional(),
    categoryId: z.string().uuid("Format categoryId tidak valid").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Minimal satu field harus diisi",
  });

export type ModuleUpdateInput = z.infer<typeof moduleUpdateSchema>;

export const modulePresignSchema = z.object({
  fileName: z.string().min(1, "Nama file wajib diisi"),
  contentType: z.string().min(1, "Content-Type wajib diisi"),
  folder: z.string().optional(),
});

export type ModulePresignInput = z.infer<typeof modulePresignSchema>;

export const moduleDeleteSchema = z.object({
  key: z.string().min(1, "Key wajib diisi"),
});

export type ModuleDeleteInput = z.infer<typeof moduleDeleteSchema>;
