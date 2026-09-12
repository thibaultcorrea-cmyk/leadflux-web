import { BasePlugin, type Meta, type PluginOpts, type Uppy, type UppyFile } from "@uppy/core";
import { abortUploadSession, completeUploadSession, createUploadSession, uploadChunk } from "./uploads-api";
import type { ChunkedUploadResult, UploadContext } from "../types/uploads";

// Le "Body" Uppy est la forme de la reponse attachee a file.response.body :
// ici, toujours le ChunkedUploadResult renvoye par completeUploadSession.
type PluginBody = ChunkedUploadResult;

export type ChunkedUploadPluginOptions = PluginOpts & {
  endpoint: string; // "/api/v1/uploads/multipart" | "/api/v1/uploads/logo"
  context: UploadContext;
  chunkSize?: number; // octets, defaut 5 Mo
};

const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024;

/**
 * Aucun plugin Uppy existant (tus, aws-s3) ne correspond a notre protocole
 * maison (creation -> chunks -> completion sur une route disque, cf.
 * features/uploads) : ce plugin encapsule `uppy.addUploader`, la primitive
 * native d'@uppy/core pour brancher un uploader personnalise.
 */
export class ChunkedUploadPlugin extends BasePlugin<ChunkedUploadPluginOptions, Meta, PluginBody> {
  constructor(uppy: Uppy<Meta, PluginBody>, opts: ChunkedUploadPluginOptions) {
    super(uppy, opts);
    this.id = opts.id ?? "ChunkedUploadPlugin";
    this.type = "uploader";
  }

  install() {
    this.uppy.addUploader(this.handleUpload);
  }

  uninstall() {
    this.uppy.removeUploader(this.handleUpload);
  }

  private handleUpload = async (fileIDs: string[], uploadID: string) => {
    const files = fileIDs.map((id) => this.uppy.getFile(id));
    const successful: UppyFile<Meta, PluginBody>[] = [];
    const failed: UppyFile<Meta, PluginBody>[] = [];

    await Promise.all(
      files.map(async (file) => {
        let uploadId: string | undefined;
        try {
          const data = file.data as Blob;
          const chunkSize = this.opts.chunkSize ?? DEFAULT_CHUNK_SIZE;
          const totalChunks = Math.max(1, Math.ceil(data.size / chunkSize));

          const session = await createUploadSession(this.opts.endpoint, {
            fileName: file.name ?? "fichier",
            mimeType: file.type ?? "application/octet-stream",
            sizeBytes: data.size,
            totalChunks,
            context: this.opts.context,
          });
          uploadId = session.uploadId;

          for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
            const start = chunkIndex * chunkSize;
            const blob = data.slice(start, start + chunkSize);
            await uploadChunk(this.opts.endpoint, { uploadId, chunkIndex, blob });
            this.uppy.emit("upload-progress", file, {
              uploadStarted: Date.now(),
              bytesUploaded: Math.min((chunkIndex + 1) * chunkSize, data.size),
              bytesTotal: data.size,
            });
          }

          const result = await completeUploadSession(this.opts.endpoint, uploadId);
          this.uppy.emit("upload-success", file, { status: 200, body: result, uploadURL: result.url });
          successful.push(file);
        } catch (error) {
          if (uploadId) {
            await abortUploadSession(this.opts.endpoint, uploadId).catch(() => {});
          }
          this.uppy.emit("upload-error", file, {
            name: "ChunkedUploadError",
            message: error instanceof Error ? error.message : "Échec de l'upload",
          });
          failed.push(file);
        }
      }),
    );

    this.uppy.addResultData(uploadID, { successful, failed });
  };
}
