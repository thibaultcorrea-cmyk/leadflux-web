import z from "zod";


export const idParamSchema = z.string().min(1, "Id is required");

export const createInitialAdminSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    email: z.email("Email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export type CreateInitialAdminDto = z.infer<typeof createInitialAdminSchema>;

