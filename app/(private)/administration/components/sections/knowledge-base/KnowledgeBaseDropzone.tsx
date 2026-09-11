"use client";

import { CloudUpload } from "lucide-react";

import { cn } from "@/lib/utils";

type KnowledgeBaseDropzoneProps = {
  onBrowseClick: () => void;
  isUploading: boolean;
};

/**
 * Dropzone purement visuelle. L'upload réel (Uppy — @uppy/core,
 * @uppy/dashboard, @uppy/react) est installé mais volontairement pas encore
 * intégré : le stockage du PDF de connaissance n'est pas tranché
 * (CLAUDE.md §4 et §8.5). En attendant, le clic déclenche seulement la
 * simulation d'enregistrement/réindexation pour que le reste de l'UI
 * (barre de progression) soit déjà en place.
 */
export function KnowledgeBaseDropzone({ onBrowseClick, isUploading }: KnowledgeBaseDropzoneProps) {
  return (
    <button
      type="button"
      onClick={onBrowseClick}
      disabled={isUploading}
      className={cn(
        "flex h-44 w-full flex-col items-center justify-center gap-2.5 rounded-lg border border-ink-300 bg-background-100 transition-colors disabled:cursor-not-allowed disabled:opacity-70",
        !isUploading && "hover:border-accent-500 hover:bg-accent-50/40"
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-accent-50">
        <CloudUpload className="size-[22px] text-accent-700" aria-hidden />
      </span>
      <span className="flex items-center gap-1 text-[15px]">
        <span className="font-medium text-ink-900">Glissez votre document ici, ou</span>
        <span className="font-semibold text-accent-700">parcourir vos fichiers</span>
      </span>
      <span className="text-xs text-ink-500">
        PDF, DOCX, Markdown ou TXT · 5 Mo max · 3 pages conseillées
      </span>
    </button>
  );
}
