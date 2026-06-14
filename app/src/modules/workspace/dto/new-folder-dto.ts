import z from "zod";

export const newFolderDto = z.object({
    name: z.string()
});

export type NewFolderDto = z.infer<typeof newFolderDto>;