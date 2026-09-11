"use client";

import { ConfirmModalContent } from "@/components/shared/Modals/ConfirmModalContent";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CONFIRMATION_WORD, useConfirmHardResetForm } from "../hooks/useConfirmHardResetForm";

const RESET_MESSAGES = {
  error: {
    title: "Erreur",
    description: "La réinitialisation a échoué. Réessayez dans un instant.",
  },
};

/**
 * Contenu de la modale "Réinitialiser Leadflux". Doit être un vrai composant
 * — pas juste construit inline dans le hook qui ouvre la modale — pour que
 * `form.formState` (validité, erreur Zod) redéclenche un rendu à chaque
 * frappe : un arbre construit une fois dans un callback resterait figé sur
 * l'état du formulaire au moment du clic d'ouverture.
 */
export function HardResetConfirmModal() {
  const { form, hardReset } = useConfirmHardResetForm();

  return (
    <ConfirmModalContent
      title="Réinitialiser Leadflux"
      description="Remise à zéro complète : toutes les données seront supprimées, y compris votre compte administrateur, et vous serez déconnecté immédiatement. Cette action est irréversible et il n'existe aucune sauvegarde automatique côté serveur : exportez ce qui doit être conservé avant de continuer."
      confirmLabel="Réinitialiser"
      tone="destructive"
      isConfirmDisabled={!form.formState.isValid}
      messages={RESET_MESSAGES}
      // Le formulaire de connexion remplace ce contenu : pas besoin de
      // fermer la modale nous-mêmes ni d'afficher de message de succès.
      closeOnConfirm={false}
      onConfirm={() => form.handleSubmit(hardReset)()}
    >
      <Field>
        <FieldLabel htmlFor="confirmation" className="font-normal">
          Saisissez <strong className="font-semibold text-ink-900">{CONFIRMATION_WORD}</strong> pour continuer.
        </FieldLabel>
        <Input
          id="confirmation"
          placeholder={CONFIRMATION_WORD}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          {...form.register("confirmation")}
        />
        {form.formState.errors.confirmation && (
          <FieldError>{form.formState.errors.confirmation.message}</FieldError>
        )}
      </Field>
    </ConfirmModalContent>
  );
}
