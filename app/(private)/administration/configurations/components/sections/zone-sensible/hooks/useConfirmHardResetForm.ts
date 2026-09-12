"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useAuthenticationClient } from "@/hooks/useAuthenticationClient";
import { waitDelay } from "@/lib/utils";
import { resetApplication } from "../services/api-services";

// Typé explicitement en `string` : sans ça, TS infère un type littéral
// `"confirmer"` à partir de la comparaison dans `.refine()` ci-dessous, ce
// qui empêche `defaultValues: { confirmation: "" }` de type-checker.
export const CONFIRMATION_WORD: string = "confirmer";

const hardResetSchema = z.object({
  confirmation: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => value === CONFIRMATION_WORD, {
      message: `Saisissez "${CONFIRMATION_WORD}" pour continuer.`,
    }),
});

export type HardResetFormValues = z.infer<typeof hardResetSchema>;

/**
 * Formulaire de la modale "Réinitialiser Leadflux" (Zone sensible) : Zod
 * compare le mot saisi à "confirmer" (même logique que `useProspectForm`
 * pour la validation), plutôt qu'un `useState` comparé à la main.
 *
 * `hardReset` porte la logique métier — mockée : aucune API de
 * réinitialisation n'est branchée (CLAUDE.md §8.8), donc "supprimer tout, y
 * compris le compte administrateur" se limite à nettoyer ce qui existe
 * réellement côté client (localStorage, session de connexion) après un
 * délai simulé, avant de renvoyer vers /login.
 */
export function useConfirmHardResetForm() {
  const form = useForm<HardResetFormValues>({
    resolver: zodResolver(hardResetSchema),
    defaultValues: { confirmation: "" },
    mode: "onChange",
  });
  const { signOut } = useAuthenticationClient();

  const hardReset = async () => {
    await waitDelay(1200);
    await resetApplication()
    localStorage.clear();
    await signOut();

  };

  return { form, hardReset };
}
