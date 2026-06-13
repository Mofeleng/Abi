import z from "zod";

export const signUpDto = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string()
});

export type SignUpDto = z.infer<typeof signUpDto>;