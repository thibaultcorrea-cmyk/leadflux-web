"use client";

import { Save } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useKnowledgeBaseSave } from "../hooks/useKnowledgeBaseSave";
import { knowledgeBaseMock } from "../../../../services/knowledge-base-mock";
import { KnowledgeBaseCurrentFile } from "./KnowledgeBaseCurrentFile";
import { KnowledgeBaseDropzone } from "./KnowledgeBaseDropzone";
import { KnowledgeBaseModeToggle, type KnowledgeBaseMode } from "./KnowledgeBaseModeToggle";
import { KnowledgeBasePasteInput } from "./KnowledgeBasePasteInput";

/**
 * Corps de la section "Base de connaissances" (maquette "KB Card") : mode
 * import/collage, fichier actuel et enregistrement. La dropzone reste
 * purement visuelle (Uppy est installé mais pas branché, cf.
 * KnowledgeBaseDropzone) : sélectionner un fichier n'y déclenche rien pour
 * l'instant. Seul le bouton "Enregistrer" lance la simulation
 * d'enregistrement/réindexation (useKnowledgeBaseSave), qui fait basculer
 * les stats d'indexation vers la barre de progression.
 */
export function KnowledgeBaseSection() {
  const [mode, setMode] = useState<KnowledgeBaseMode>("file");
  const file = knowledgeBaseMock.getCurrentFile();
  const version = knowledgeBaseMock.getCurrentVersion();
  const { status, progress, stats, save } = useKnowledgeBaseSave(knowledgeBaseMock.getIndexStats());
  const isSaving = status === "saving";

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6">
      <KnowledgeBaseModeToggle mode={mode} onModeChange={setMode} />

      {mode === "file" ? <KnowledgeBaseDropzone /> : <KnowledgeBasePasteInput />}

      <KnowledgeBaseCurrentFile file={file} isSaving={isSaving} progress={progress} stats={stats} />

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
        <p className="max-w-[46ch] text-xs leading-relaxed text-ink-500">
          Chaque enregistrement remplace le texte source et relance l&apos;indexation. Les emails
          déjà générés gardent les passages qu&apos;ils ont utilisés au moment de leur rédaction.
        </p>
        <Button
          type="button"
          size="lg"
          className="h-11 gap-2 px-[18px] text-[15px] font-semibold"
          onClick={save}
          disabled={isSaving}
        >
          <Save className="size-4" aria-hidden />
          Enregistrer en version {version.number + 1}
        </Button>
      </div>
    </div>
  );
}
