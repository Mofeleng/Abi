import z from "zod";

export const uploadFileDto = z.object({
    filename: z.string(),
    type: z.enum(["xlsx", "xls", "csv", "pdf", "txt"])
});

export type UploadFileDto = z.infer<typeof uploadFileDto>;