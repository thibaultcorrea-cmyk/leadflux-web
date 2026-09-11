"use client";

import { useModalController } from "@/hooks/useModalController";
import { HardResetConfirmModal } from "../components/HardResetConfirmModal";

/**
 * Ouvre la modale de confirmation de la Zone sensible. Le formulaire (champ
 * de confirmation validé par Zod) et la logique de réinitialisation vivent
 * dans `HardResetConfirmModal` / `useConfirmHardResetForm` ; ce hook ne fait
 * qu'ouvrir la modale.
 */
export function useResetApplicationAction() {
  const { open } = useModalController();

  const openResetApplication = () =>
    open({
      // Une nouvelle clé à chaque ouverture force un nouveau montage (donc un
      // formulaire vierge) même si la précédente instance n'a pas encore fini
      // de se démonter (fermeture puis réouverture rapprochées).
      components: <HardResetConfirmModal key={Date.now()} />,
      // Une réinitialisation ne doit pas s'interrompre sur un clic maladroit
      // à l'extérieur de la modale.
      disablePointerDismissal: true,
    });

  return { openResetApplication };
}
