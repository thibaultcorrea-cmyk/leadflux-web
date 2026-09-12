"use client";

import { useChunkedUploader } from "../../../../hooks/useChunkedUploader";
import { createKnowledgeBaseVersion } from "../../../../services/knowledge-base-api";
import type { ChunkedUploadResult } from "../../../../types/uploads";

const KNOWLEDGE_BASE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Upload chunke (features/uploads, route /api/v1/uploads/multipart, contexte
 * "knowledge-base") + creation de la ligne knowledge_base qui reference le
 * fichier stocke. Ne remplace pas useKnowledgeBaseSave (reindexation simulee,
 * hors scope) : les deux s'enchainent depuis KnowledgeBaseSection.
 */
export function useKnowledgeBaseUpload() {
  const uploader = useChunkedUploader({
    endpoint: "/api/v1/uploads/multipart",
    context: "knowledge-base",
    restrictions: {
      allowedFileTypes: [".pdf", ".docx", ".md", ".txt"],
      maxFileSize: KNOWLEDGE_BASE_MAX_SIZE_BYTES,
    },
  });

  const uploadAndCreateVersion = async (versionName: string) => {
    const uploadResult = await uploader.startUpload();
    const body = uploadResult?.successful?.[0]?.response?.body as ChunkedUploadResult | undefined;

    if (!body) {
      throw new Error(uploader.error ?? "Échec de l'envoi du fichier");
    }

    return createKnowledgeBaseVersion({ fileId: body.file.id, name: versionName });
  };

  return { ...uploader, uploadAndCreateVersion };
}
