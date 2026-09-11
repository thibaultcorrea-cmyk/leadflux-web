import { FileCheck2 } from "lucide-react";

import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { knowledgeBaseMock } from "../../services/knowledge-base-mock";
import { MarkdownPreview } from "./markdown-preview";

/**
 * Contenu de la modale "Voir un exemple complet" (lien de l'aide "Rédiger
 * une bonne base de connaissance"). Réutilise MarkdownPreview — même rendu
 * que l'aperçu du texte extrait — pour un exemple qui suit les 6 blocs
 * attendus et les règles de découpage RAG.
 */
export function KnowledgeBaseExampleModal() {
  const example = knowledgeBaseMock.getFormattingExample();

  return (
    <div className="flex flex-col gap-4 p-2">
      <header className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-success-50">
          <FileCheck2 className="size-5 text-success" aria-hidden />
        </span>
        <div className="flex flex-col gap-0.5">
          <DialogTitle className="text-[15px] font-semibold text-ink-900">
            Exemple de base de connaissance
          </DialogTitle>
          <DialogDescription className="text-xs text-ink-500">
            Les 6 blocs attendus, dans l&apos;ordre, un fait par paragraphe.
          </DialogDescription>
        </div>
      </header>

      <MarkdownPreview content={example} />
    </div>
  );
}
