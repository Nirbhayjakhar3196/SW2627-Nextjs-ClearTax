import { z } from "zod";

export const invoiceUploadSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().nonnegative().optional(),
});
