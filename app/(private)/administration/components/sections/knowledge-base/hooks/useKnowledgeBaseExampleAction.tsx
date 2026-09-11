"use client";

import { useModalController } from "@/hooks/useModalController";
import { KnowledgeBaseExampleModal } from "../modals/knowledge-base-example-modal";

/** L'aperçu suit la longueur de ligne de lecture du design system : 720 px. */
const EXAMPLE_MODAL_CLASSNAME = "sm:min-w-[42vw] sm:max-w-[52vw]";

export function useKnowledgeBaseExampleAction() {
  const { open } = useModalController();

  const openExample = () =>
    open({
      contentClassName: EXAMPLE_MODAL_CLASSNAME,
      components: <KnowledgeBaseExampleModal />,
    });

  return { openExample };
}
