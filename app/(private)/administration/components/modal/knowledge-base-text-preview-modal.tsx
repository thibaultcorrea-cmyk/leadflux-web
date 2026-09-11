"use client";

import { FileText } from "lucide-react";
import dynamic from "next/dynamic";

import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { KnowledgeBaseFile } from "../../types/knowledge-base";
import { MarkdownPreview } from "./markdown-preview";
import { PlainTextPreview } from "./plain-text-preview";

// react-pdf touche des API navigateur : on saute le rendu serveur, comme le
// recommande la doc react-pdf pour Next.js (App Router).
const PdfPreview = dynamic(() => import("./pdf-preview").then((mod) => mod.PdfPreview), {
  ssr: false,
});

type KnowledgeBaseTextPreviewModalProps = {
  file: KnowledgeBaseFile;
};

/**
 * Aperçu du texte extrait d'un fichier de la base de connaissances
 * (maquette "Fichier actuel" → bouton "Aperçu du texte"). Le rendu dépend du
 * type de fichier source : PDF affiche le document original (react-pdf),
 * Markdown affiche le texte extrait formaté (react-markdown), DOCX/TXT
 * affichent le texte extrait brut.
 */
export function KnowledgeBaseTextPreviewModal({ file }: KnowledgeBaseTextPreviewModalProps) {
  return (
    <div className="flex flex-col gap-4 p-2">
      <header className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-50">
          <FileText className="size-5 text-primary-700" aria-hidden />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <DialogTitle className="truncate text-[15px] font-semibold text-ink-900">
            {file.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-ink-500">
            {file.wordCount.toLocaleString("fr-FR")} mots extraits · {file.uploadedAtLabel}
          </DialogDescription>
        </div>
      </header>

      {file.type === "pdf" && file.previewUrl ? (
        <PdfPreview url={file.previewUrl} />
      ) : file.type === "md" ? (
        <MarkdownPreview content={file.extractedText} />
      ) : (
        <PlainTextPreview content={file.extractedText} />
      )}
    </div>
  );
}
