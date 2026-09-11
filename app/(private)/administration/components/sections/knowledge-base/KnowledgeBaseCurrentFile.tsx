"use client";

import { Download, Eye, FileText } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTextPreviewAction } from "../../../hooks/useTextPreviewAction";
import type { KnowledgeBaseFile, KnowledgeBaseIndexStats } from "../../../types/knowledge-base";
import { KnowledgeBaseIndexStatsView } from "./KnowledgeBaseIndexStatsView";
import { KnowledgeBaseSaveProgress } from "./KnowledgeBaseSaveProgress";

type KnowledgeBaseCurrentFileProps = {
  file: KnowledgeBaseFile;
  isSaving: boolean;
  progress: number;
  stats: KnowledgeBaseIndexStats;
};

const ACTION_BUTTON_CLASSNAME = "h-[34px] gap-1.5 px-3 text-[13px] font-medium text-ink-900";

export function KnowledgeBaseCurrentFile({
  file,
  isSaving,
  progress,
  stats,
}: KnowledgeBaseCurrentFileProps) {
  const { openTextPreview } = useTextPreviewAction();

  return (
    <div className="flex flex-col gap-3.5 rounded-md border border-border bg-background-100 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-50">
            <FileText className="size-5 text-primary-700" aria-hidden />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate text-sm font-semibold text-ink-900">{file.name}</p>
            <p className="text-xs text-ink-500">
              {file.sizeLabel} · {file.uploadedAtLabel} · {file.wordCount.toLocaleString("fr-FR")} mots
              extraits
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className={ACTION_BUTTON_CLASSNAME}
            onClick={() => openTextPreview(file)}
          >
            <Eye className="size-3.5" aria-hidden />
            Aperçu du texte
          </Button>
          {file.previewUrl ? (
            <a
              href={file.previewUrl}
              download={file.name}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), ACTION_BUTTON_CLASSNAME)}
            >
              <Download className="size-3.5" aria-hidden />
              Télécharger
            </a>
          ) : (
            <Button type="button" variant="outline" size="lg" className={ACTION_BUTTON_CLASSNAME} disabled>
              <Download className="size-3.5" aria-hidden />
              Télécharger
            </Button>
          )}
        </div>
      </div>

      {isSaving ? (
        <KnowledgeBaseSaveProgress progress={progress} />
      ) : (
        <KnowledgeBaseIndexStatsView stats={stats} />
      )}
    </div>
  );
}
