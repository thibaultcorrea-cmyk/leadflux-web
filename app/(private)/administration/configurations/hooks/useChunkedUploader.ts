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
};

export function useChunkedUploader({ endpoint, context, restrictions }: UseChunkedUploaderOptions) {
  const [status, setStatus] = useState<ChunkedUploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ChunkedUploadResult | null>(null);

  const uppy = useMemo(() => {
    return new Uppy<Meta, ChunkedUploadResult>({
      autoProceed: false,
      restrictions: { maxNumberOfFiles: 1, ...restrictions },
    }).use(ChunkedUploadPlugin, { id: "ChunkedUploadPlugin", endpoint, context });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, context]);

  const progress = useUppyState(uppy, (state) => state.totalProgress);

  useUppyEvent(uppy, "upload", () => {
    setStatus("uploading");
    setError(null);
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
    uppy.addFile({ name: file.name, type: file.type, data: file });
    setStatus("idle");
    setError(null);
    setResult(null);
  };

  const startUpload = () => uppy.upload();

  const reset = () => {
    uppy.getFiles().forEach((existing) => uppy.removeFile(existing.id));
    setStatus("idle");
    setError(null);
    setResult(null);
  };

  return { selectFile, startUpload, reset, status, progress, error, result };
}
