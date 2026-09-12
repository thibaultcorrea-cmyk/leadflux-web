export type UploadContext = "logo" | "knowledge-base" | "generic";

export type ChunkedUploadResult = {
  file: {
    id: string;
    originalName: string;
    size: number;
    type: string;
    extension: string;
  };
  url: string;
};

export type ChunkedUploadStatus = "idle" | "uploading" | "success" | "error";
