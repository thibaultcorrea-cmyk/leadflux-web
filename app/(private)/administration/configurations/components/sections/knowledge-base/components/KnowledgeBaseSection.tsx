"use client";

import { Save } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toaster";
import { useKnowledgeBaseSave } from "../hooks/useKnowledgeBaseSave";
import { useKnowledgeBaseUpload } from "../hooks/useKnowledgeBaseUpload";
import { knowledgeBaseMock } from "../../../../services/knowledge-base-mock";
import { UploadDropzone } from "../../../shared/UploadDropzone";
import { KnowledgeBaseCurrentFile } from "./KnowledgeBaseCurrentFile";
import { KnowledgeBaseModeToggle, type KnowledgeBaseMode } from "./KnowledgeBaseModeToggle";
import { KnowledgeBasePasteInput } from "./KnowledgeBasePasteInput";

/**
 * Corps de la section "Base de connaissances" (maquette "KB Card") : mode
 * import/collage, fichier actuel et enregistrement. En mode "file", un
 * fichier selectionne declenche un vrai upload chunke (features/uploads,
 * useKnowledgeBaseUpload) avant la simulation d'enregistrement/reindexation
 * existante (useKnowledgeBaseSave) — quelle version est "active" reste
 * mockee (knowledgeBaseMock), hors scope de ce chantier.
 */
export function KnowledgeBaseSection() {
  const [mode, setMode] = useState<KnowledgeBaseMode>("file");
  const [hasSelectedFile, setHasSelectedFile] = useState(false);
  const file = knowledgeBaseMock.getCurrentFile();
  const version = knowledgeBaseMock.getCurrentVersion();
  const { status, progress, stats, save } = useKnowledgeBaseSave(knowledgeBaseMock.getIndexStats());
  const upload = useKnowledgeBaseUpload();
  const isSaving = status === "saving";
  const isUploading = upload.status === "uploading";

  const handleFileSelected = (selected: File) => {
    upload.selectFile(selected);
    setHasSelectedFile(true);
  };

  const handleSave = async () => {
    if (hasSelectedFile) {
      try {
        await upload.uploadAndCreateVersion(`version-${Date.now()}`);
        setHasSelectedFile(false);
      } catch (error) {
        toast.error({
          title: "Échec de l'envoi",
          description: error instanceof Error ? error.message : "Le fichier n'a pas pu être enregistré.",
        });
        return;
      }
    }
    await save();
  };

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6">
      <KnowledgeBaseModeToggle mode={mode} onModeChange={setMode} />

      {mode === "file" ? (
        <UploadDropzone
          hint="PDF, DOCX, Markdown ou TXT · 5 Mo max · 3 pages conseillées"
          accept=".pdf,.docx,.md,.txt"
          disabled={isUploading || isSaving}
          onFileSelected={handleFileSelected}
        />
      ) : (
        <KnowledgeBasePasteInput />
      )}

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
          onClick={handleSave}
          disabled={isSaving || isUploading}
        >
          <Save className="size-4" aria-hidden />
          {isUploading ? "Envoi en cours…" : `Enregistrer en version ${version.number + 1}`}
        </Button>
      </div>
    </div>
  );
}
