"use client";

import { ConfirmModalContent } from "@/components/shared/Modals/ConfirmModalContent";
import { useAuthenticationClient } from "@/hooks/useAuthenticationClient";
import { useModalController } from "@/hooks/useModalController";
import { waitDelay } from "@/lib/utils";

const CONFIRMATION_WORD = "confirmer";

const RESET_MESSAGES = {
  error: {
    title: "Erreur",
    description: "La réinitialisation a échoué. Réessayez dans un instant.",
  },
};

/**
 * Action de la Zone sensible : aucune API de réinitialisation n'est branchée
 * (tout est mocké, CLAUDE.md §8.8), donc "réinitialiser" se limite à simuler
 * un traitement puis à nettoyer ce qui existe réellement côté client — le
 * localStorage et la session de connexion — avant de renvoyer vers /login,
 * comme le ferait une vraie remise à zéro.
 */
export function useResetApplicationAction() {
  const { open } = useModalController();
  const { signOut } = useAuthenticationClient();

  const openResetApplication = () =>
    open({
      components: (
        <ConfirmModalContent
          title="Réinitialiser Leadflux"
          description="Remise à zéro complète : toutes les données seront supprimées, y compris votre compte administrateur, et vous serez déconnecté immédiatement. Cette action est irréversible et il n'existe aucune sauvegarde automatique côté serveur : exportez ce qui doit être conservé avant de continuer."
          confirmLabel="Réinitialiser"
          tone="destructive"
          confirmationWord={CONFIRMATION_WORD}
          messages={RESET_MESSAGES}
          // Le formulaire de connexion remplace ce contenu : pas besoin de
          // fermer la modale nous-mêmes ni d'afficher de message de succès.
          closeOnConfirm={false}
          onConfirm={async () => {
            await waitDelay(1200);
            localStorage.clear();
            await signOut();
          }}
        />
      ),
      // Une réinitialisation ne doit pas s'interrompre sur un clic maladroit
      // à l'extérieur de la modale.
      disablePointerDismissal: true,
    });

  return { openResetApplication };
}
