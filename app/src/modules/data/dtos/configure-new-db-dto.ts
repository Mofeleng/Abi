import z from "zod";

export const configureNewDatabaseDto = z.object({
    name: z.string(),
    databaseConnectionString: z.string(),
    type: z.enum(["POSTGRES", "MONGO", "MYSQL"])
});

export type ConfigureNewDatabaseDto = z.infer<typeof configureNewDatabaseDto>;