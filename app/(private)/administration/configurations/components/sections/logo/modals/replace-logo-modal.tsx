"use client";

import { Upload } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useModalController } from "@/hooks/useModalController";
import { toast } from "@/lib/toaster";
import { useChunkedUploader } from "../../../../hooks/useChunkedUploader";
import { UploadDropzone } from "../../../shared/UploadDropzone";

const LOGO_MAX_SIZE_BYTES = 2 * 1024 * 1024;

/**
 * Contenu de la modale "Remplacer le logo". L'upload passe par le protocole
 * chunke maison (features/uploads, route /api/v1/uploads/logo) : la ligne
 * `files` resultante existe bel et bien en base, mais quel logo est "actif"
 * n'est pas persiste ici (logoMock/LogoSection restent inchanges, decision
 * de stockage non tranchee — cf. CLAUDE.md §4/§8.5).
 */
export function ReplaceLogoModal() {
  const { close } = useModalController();
  const { selectFile, startUpload, status, error, result } = useChunkedUploader({
    endpoint: "/api/v1/uploads/logo",
    context: "logo",
    restrictions: {
      allowedFileTypes: [".png", ".jpg", ".jpeg", ".webp"],
      maxFileSize: LOGO_MAX_SIZE_BYTES,
    },
  });

  const isUploading = status === "uploading";

  useEffect(() => {
    if (status === "success" && result) {
      toast.success({
        title: "Logo remplacé",
        description: "Le nouveau logo a bien été envoyé.",
      });
      close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, result]);

  const handleReplace = async () => {
    await startUpload();
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex flex-col gap-1">
        <DialogTitle className="text-[15px] font-semibold text-ink-900">
          Remplacer le logo
        </DialogTitle>
        <DialogDescription className="text-xs text-ink-500">
          Le nouveau logo remplace l&apos;actuel partout : barre latérale et signature des emails.
        </DialogDescription>
      </div>

      <UploadDropzone
        hint="PNG, JPEG ou WebP · 2 Mo max · 512 px de large minimum · fond transparent recommandé. Pas de SVG."
        accept="image/png,image/jpeg,image/webp"
        disabled={isUploading}
        onFileSelected={selectFile}
      />

      {status === "error" && (
        <p role="alert" className="text-xs text-red-600">
          {error ?? "Une erreur est survenue pendant l'envoi."}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          size="lg"
          className="h-10 gap-2 px-4 text-sm font-semibold"
          onClick={handleReplace}
          disabled={isUploading}
        >
          <Upload className="size-[15px]" aria-hidden />
          {isUploading ? "Envoi en cours…" : "Remplacer"}
        </Button>
      </div>
    </div>
  );
}
