import { z } from "zod";

export const progressUpdateSchema = z.object({
  moduleId: z.string().uuid("Format moduleId tidak valid"),
  isCompleted: z.boolean(),
});

export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>;
