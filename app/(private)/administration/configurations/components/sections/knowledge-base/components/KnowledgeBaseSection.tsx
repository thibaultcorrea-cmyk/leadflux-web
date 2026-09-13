"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toaster";
import { useKnowledgeBaseSave } from "../hooks/useKnowledgeBaseSave";
import { useKnowledgeBaseUpload } from "../hooks/useKnowledgeBaseUpload";
import { UploadDropzone } from "../../../shared/UploadDropzone";
import { KnowledgeBaseCurrentFile } from "./KnowledgeBaseCurrentFile";
import { KnowledgeBaseModeToggle, type KnowledgeBaseMode } from "./KnowledgeBaseModeToggle";
import { KnowledgeBasePasteInput } from "./KnowledgeBasePasteInput";
import { KnowledgeBaseSelectedFilePreview } from "./KnowledgeBaseSelectedFilePreview";
import { KnowledgeBaseFile, KnowledgeBaseIndexStats } from "../../../../types/knowledge-base";
import { useQueryClient } from "@tanstack/react-query";
import { KNOWLEDGE_BASE_QUERIES_KEYS } from "../services/queries";

/**
 * Corps de la section "Base de connaissances" (maquette "KB Card") : mode
 * import/collage, fichier actuel et enregistrement. En mode "file", un
 * fichier selectionne declenche un vrai upload chunke (features/uploads,
 * useKnowledgeBaseUpload) avant la simulation d'enregistrement/reindexation
 * existante (useKnowledgeBaseSave) — quelle version est "active" reste
 * mockee (knowledgeBaseMock), hors scope de ce chantier.
 */
type KnowledgeBaseSectionProps = {
  currentKnowledgeBaseFile: KnowledgeBaseFile
}
export function KnowledgeBaseSection({ currentKnowledgeBaseFile }: KnowledgeBaseSectionProps) {
  const [mode, setMode] = useState<KnowledgeBaseMode>("file");
  const [hasSelectedFile, setHasSelectedFile] = useState(false);
  const file = currentKnowledgeBaseFile;


  const KnowledgeBaseIndex = {
    passagesIndexed: file.wordCount,
    reindexedAtLabel: file.uploadedAtDatetime,
  } satisfies KnowledgeBaseIndexStats



  const { status, progress, stats, save } = useKnowledgeBaseSave(KnowledgeBaseIndex);


  const upload = useKnowledgeBaseUpload();
  const isSaving = status === "saving";
  const isUploading = upload.status === "uploading";
  const queryClient = useQueryClient();



  const handleFileSelected = (selected: File) => {
    upload.selectFile(selected);
    setHasSelectedFile(true);
  };

  const handleRemoveSelectedFile = () => {
    upload.reset();
    setHasSelectedFile(false);
  };

  const handleSave = async () => {
    if (hasSelectedFile) {
      try {
        await upload.uploadAndCreateVersion(`version-${Date.now()}`);
        setHasSelectedFile(false);
        queryClient.invalidateQueries({ queryKey: [KNOWLEDGE_BASE_QUERIES_KEYS.GET_LAST_KNOWLEDGE_BASE] })
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

      {hasSelectedFile && upload.selectedFile ? (
        <KnowledgeBaseSelectedFilePreview
          file={upload.selectedFile}
          onRemove={handleRemoveSelectedFile}
          disabled={isUploading}
        />
      ) : (
        <KnowledgeBaseCurrentFile file={file} isSaving={isSaving} progress={progress} />
      )}

      <div className="flex flex-col  gap-4 border-t border-border pt-5">
        <p className=" text-xs leading-relaxed text-ink-500">
          Chaque enregistrement remplace le texte source et relance l&apos;indexation. Les emails
          déjà générés gardent les passages qu&apos;ils ont utilisés au moment de leur rédaction.
        </p>
        <Button
          type="button"
          size="lg"
          className="h-11 gap-2 px-[18px] text-xs font-semibold sm:self-end"
          onClick={handleSave}
          disabled={isSaving || isUploading}
        >
          <Save className="size-4" aria-hidden />
          {isUploading ? "Envoi en cours…" : `Enregistrer la nouvelle version`}
        </Button>
      </div>
    </div>
  );
}
