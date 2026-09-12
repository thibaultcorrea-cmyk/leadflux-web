"use client";

import { CircleAlert, CircleCheck, Loader2, RotateCw } from "lucide-react";
import { useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/lib/utils";
import type { ChunkedUploadStatus } from "../../../../types/uploads";

type LogoFilePreviewCardProps = {
  file: File;
  status: ChunkedUploadStatus;
  progress: number;
  error: string | null;
  onRetry: () => void;
  onChangeFile: () => void;
};

/**
 * Aperçu du fichier logo selectionne : miniature, nom, taille, et statut de
 * l'envoi qui demarre automatiquement des la selection (pas de bouton
 * "Remplacer" intermediaire, cf. ReplaceLogoModal). L'URL d'objet est locale
 * au navigateur (jamais envoyee au serveur) et revoquee au demontage/
 * changement de fichier pour ne pas fuir de memoire.
 */
export function LogoFilePreviewCard({ file, status, progress, error, onRetry, onChangeFile }: LogoFilePreviewCardProps) {
  // Calcule au rendu (pas via un effet + setState) : evite un rendu
  // supplementaire avant l'affichage de la miniature. L'effet ci-dessous ne
  // sert qu'a revoquer l'URL precedente, jamais a poser du state.
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-background-100 p-3">
      <div className="flex items-center gap-3">
        <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background">
          {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local d'un File pas encore uploadé, jamais une image servie par Next/CDN. */}
          <img src={previewUrl} alt="" className="size-full object-contain" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-sm font-semibold text-ink-900">{file.name}</p>
          <p className="text-xs text-ink-500">{formatFileSize(file.size)}</p>
        </div>
      </div>

      {status === "uploading" && (
        <div className="flex items-center gap-2">
          <Loader2 className="size-4 shrink-0 animate-spin text-accent-700" aria-hidden />
          <Progress value={progress} className="flex-1 [&_[data-slot=progress-track]]:h-1.5" />
          <span className="text-xs tabular-nums text-ink-500">{Math.round(progress)}%</span>
        </div>
      )}

      {status === "success" && (
        <p className="flex items-center gap-2 text-xs font-medium text-success">
          <CircleCheck className="size-4 shrink-0" aria-hidden />
          Envoyé
        </p>
      )}

      {status === "error" && (
        <div className="flex flex-col gap-2">
          <p role="alert" className="flex items-center gap-2 text-xs text-destructive">
            <CircleAlert className="size-4 shrink-0" aria-hidden />
            {error ?? "Échec de l'envoi."}
          </p>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" className="h-8 gap-1.5 px-3 text-xs" onClick={onRetry}>
              <RotateCw className="size-3.5" aria-hidden />
              Réessayer
            </Button>
            <Button type="button" size="sm" variant="ghost" className="h-8 px-3 text-xs" onClick={onChangeFile}>
              Choisir un autre fichier
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
