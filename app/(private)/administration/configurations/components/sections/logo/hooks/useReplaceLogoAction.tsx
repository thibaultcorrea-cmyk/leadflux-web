"use client";

import { useModalController } from "@/hooks/useModalController";
import { ReplaceLogoModal } from "../modals/replace-logo-modal";

const REPLACE_LOGO_MODAL_CLASSNAME = "sm:max-w-[440px]";

export function useReplaceLogoAction() {
  const { open } = useModalController();

  const openReplaceLogo = () =>
    open({
      contentClassName: REPLACE_LOGO_MODAL_CLASSNAME,
      components: <ReplaceLogoModal />,
      // Un clic à l'extérieur pendant une sélection de fichier ne doit pas
      // fermer la modale et faire perdre l'action en cours.
      disablePointerDismissal: true,
    });

  return { openReplaceLogo };
}
