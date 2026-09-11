"use client";

import { useModalController } from "@/hooks/useModalController";
import { KnowledgeBaseTextPreviewModal } from "../components/modal/knowledge-base-text-preview-modal";
import type { KnowledgeBaseFile } from "../types/knowledge-base";

/** L'aperçu suit la longueur de ligne de lecture du design system : 720 px. */
const PREVIEW_MODAL_CLASSNAME = "sm:min-w-[42vw] sm:max-w-[52vw]";

export function useTextPreviewAction() {
  const { open } = useModalController();

  const openTextPreview = (file: KnowledgeBaseFile) =>
    open({
      contentClassName: PREVIEW_MODAL_CLASSNAME,
      components: <KnowledgeBaseTextPreviewModal file={file} />,
    });

  return { openTextPreview };
}
