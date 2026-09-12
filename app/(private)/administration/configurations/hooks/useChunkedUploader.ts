"use client";

import Uppy, { type Meta } from "@uppy/core";
import { useUppyEvent, useUppyState } from "@uppy/react";
import { useMemo, useState } from "react";
import { ChunkedUploadPlugin } from "../services/uppy-chunked-upload-plugin";
import type { ChunkedUploadResult, ChunkedUploadStatus, UploadContext } from "../types/uploads";

type UseChunkedUploaderOptions = {
  endpoint: string;
  context: UploadContext;
  restrictions?: { allowedFileTypes?: string[]; maxFileSize?: number };
  /**
   * true : l'upload demarre des qu'un fichier valide est ajoute, sans bouton
   * de confirmation intermediaire (logo, cf. ReplaceLogoModal). false
   * (defaut) : le fichier est seulement stage/previsualise, l'appelant
   * declenche l'envoi lui-meme via startUpload() (base de connaissance,
   * declenchee par le bouton "Enregistrer en version").
   */
  autoUpload?: boolean;
};

/**
 * Uppy rejette les fichiers hors restrictions avant meme d'appeler
 * l'uploader : `restriction-failed` couvre ce cas (mauvais type/trop
 * volumineux), distinct de `upload-error` (echec reseau/serveur pendant
 * l'envoi).
 */
export function useChunkedUploader({ endpoint, context, restrictions, autoUpload = false }: UseChunkedUploaderOptions) {
  const [status, setStatus] = useState<ChunkedUploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ChunkedUploadResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uppy = useMemo(() => {
    return new Uppy<Meta, ChunkedUploadResult>({
      autoProceed: autoUpload,
      restrictions: { maxNumberOfFiles: 1, ...restrictions },
    }).use(ChunkedUploadPlugin, { id: "ChunkedUploadPlugin", endpoint, context });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, context, autoUpload]);

  const progress = useUppyState(uppy, (state) => state.totalProgress);

  useUppyEvent(uppy, "upload", () => {
    setStatus("uploading");
    setError(null);
  });

  useUppyEvent(uppy, "restriction-failed", (_file, restrictionError) => {
    setStatus("error");
    setError(restrictionError.message);
  });

  useUppyEvent(uppy, "upload-error", (_file, uploadError) => {
    setStatus("error");
    setError(uploadError.message);
  });

  useUppyEvent(uppy, "complete", (uploadResult) => {
    const successfulFile = uploadResult.successful?.[0];
    const response = successfulFile?.response?.body as ChunkedUploadResult | undefined;
    if (response) {
      setResult(response);
      setStatus("success");
    }
  });

  const selectFile = (file: File) => {
    uppy.getFiles().forEach((existing) => uppy.removeFile(existing.id));
    setStatus("idle");
    setError(null);
    setResult(null);
    setSelectedFile(file);

    try {
      uppy.addFile({ name: file.name, type: file.type, data: file });
    } catch (addFileError) {
      setStatus("error");
      setError(addFileError instanceof Error ? addFileError.message : "Fichier invalide");
    }
  };

  const startUpload = () => uppy.upload();

  const reset = () => {
    uppy.getFiles().forEach((existing) => uppy.removeFile(existing.id));
    setSelectedFile(null);
    setStatus("idle");
    setError(null);
    setResult(null);
  };

  return { selectFile, startUpload, reset, status, progress, error, result, selectedFile };
}
