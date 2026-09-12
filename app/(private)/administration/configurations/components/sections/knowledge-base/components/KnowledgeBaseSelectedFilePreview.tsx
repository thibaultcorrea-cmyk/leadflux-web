"use client";

import { File as FileIcon, FileCode, FileText, FileType, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatFileSize } from "@/lib/utils";

type KnowledgeBaseSelectedFilePreviewProps = {
  file: File;
  onRemove: () => void;
  disabled?: boolean;
};

const FILE_TYPE_ICONS: Record<string, typeof FileText> = {
  pdf: FileText,
  docx: FileType,
  md: FileCode,
  txt: FileIcon,
};

/**
 * Aperçu du fichier tout juste sélectionné dans la dropzone, avant l'envoi
 * reel (declenche plus tard par le bouton "Enregistrer"). Remplace
 * KnowledgeBaseCurrentFile le temps de cette selection : ce dernier decrit la
 * version deja indexee, pas le fichier en attente d'upload.
 */
export function KnowledgeBaseSelectedFilePreview({
  file,
  onRemove,
  disabled,
}: KnowledgeBaseSelectedFilePreviewProps) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const Icon = FILE_TYPE_ICONS[extension] ?? FileIcon;

  return (
    <div className="flex min-w-0 items-center justify-between gap-4 rounded-md border border-border bg-background-100 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-50">
          <Icon className="size-5 text-primary-700" aria-hidden />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-sm font-semibold text-ink-900">{file.name}</p>
          <p className="text-xs text-ink-500">{formatFileSize(file.size)}</p>
        </div>
      </div>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Supprimer le fichier"
              onClick={onRemove}
              disabled={disabled}
              className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
            />
          }
        >
          <Trash2 className="size-3.5" aria-hidden />
        </TooltipTrigger>
        <TooltipContent>Supprimer le fichier</TooltipContent>
      </Tooltip>
    </div>
  );
}
