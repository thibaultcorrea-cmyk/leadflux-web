import { API_BASE_URL } from "@/core/params";
import type { ChunkedUploadResult, UploadContext } from "../types/uploads";

export const createUploadSession = async (
  endpoint: string,
  body: { fileName: string; mimeType: string; sizeBytes: number; totalChunks: number; context: UploadContext },
): Promise<{ uploadId: string }> => {
  const url = new URL(endpoint, API_BASE_URL);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Échec de la création de la session d'upload");
  return res.json();
};

export const uploadChunk = async (
  endpoint: string,
  params: { uploadId: string; chunkIndex: number; blob: Blob },
): Promise<void> => {
  const url = new URL(endpoint, API_BASE_URL);
  url.searchParams.set("uploadId", params.uploadId);
  url.searchParams.set("chunkIndex", String(params.chunkIndex));
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/octet-stream" },
    body: params.blob,
  });
  if (!res.ok) throw new Error("Échec de l'envoi d'un fragment");
};

export const completeUploadSession = async (endpoint: string, uploadId: string): Promise<ChunkedUploadResult> => {
  const url = new URL(endpoint, API_BASE_URL);
  url.searchParams.set("uploadId", uploadId);
  const res = await fetch(url, { method: "PUT" });
  if (!res.ok) throw new Error("Échec de la finalisation de l'upload");
  return res.json();
};

export const abortUploadSession = async (endpoint: string, uploadId: string): Promise<void> => {
  const url = new URL(endpoint, API_BASE_URL);
  url.searchParams.set("uploadId", uploadId);
  await fetch(url, { method: "DELETE" });
};
