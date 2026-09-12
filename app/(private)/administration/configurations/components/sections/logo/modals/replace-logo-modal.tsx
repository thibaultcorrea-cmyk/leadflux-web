"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useModalController } from "@/hooks/useModalController";
import { toast } from "@/lib/toaster";
import { useChunkedUploader } from "../../../../hooks/useChunkedUploader";
import { UploadDropzone } from "../../../shared/UploadDropzone";
import { LogoFilePreviewCard } from "../components/LogoFilePreviewCard";
import { useQueryClient } from "@tanstack/react-query";
import { LOGO_QUERY_KEY } from "@/hooks/useCurrentCompanyLogo";

const LOGO_MAX_SIZE_BYTES = 2 * 1024 * 1024;

/**
 * Contenu de la modale "Remplacer le logo". L'upload passe par le protocole
 * chunke maison (features/uploads, route /api/v1/uploads/logo) et demarre
 * automatiquement des qu'un fichier valide est selectionne — pas de bouton de
 * confirmation intermediaire, cf. la carte d'apercu (LogoFilePreviewCard) qui
 * remplace la dropzone une fois un fichier choisi. La modale ne se ferme pas
 * toute seule au succes : l'utilisateur voit le resultat et ferme lui-meme
 * via le bouton pleine largeur en bas. La ligne `files` resultante existe
 * bel et bien en base, mais quel logo est "actif" n'est pas persiste ici
 * (logoMock/LogoSection restent inchanges, decision de stockage non
 * tranchee — cf. CLAUDE.md §4/§8.5).
 */
export function ReplaceLogoModal() {
  const { close } = useModalController();
  const { selectFile, startUpload, reset, status, progress, error, result, selectedFile } = useChunkedUploader({
    endpoint: "/api/v1/uploads/logo",
    context: "logo",
    autoUpload: true,
    restrictions: {
      allowedFileTypes: [".png", ".jpg", ".jpeg", ".webp"],
      maxFileSize: LOGO_MAX_SIZE_BYTES,
    },
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (status === "success" && result) {
      queryClient.invalidateQueries({ queryKey: [LOGO_QUERY_KEY.GET_CURRENT_COMPANY_LOGO] })
      toast.success({
        title: "Logo remplacé",
        description: "Le nouveau logo a bien été envoyé.",
      });
    }
  }, [status, result]);

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex flex-col gap-1">
        <DialogTitle className="text-[15px] font-semibold text-ink-900">
          Remplacer le logo
        </DialogTitle>
        <DialogDescription className="text-xs text-ink-500">
          Le nouveau logo remplace l&apos;actuel partout : barre latérale et signature des emails.
          L&apos;envoi démarre automatiquement dès que vous choisissez un fichier valide.
        </DialogDescription>
      </div>

      {selectedFile ? (
        <LogoFilePreviewCard
          file={selectedFile}
          status={status}
          progress={progress}
          error={error}
          onRetry={startUpload}
          onChangeFile={reset}
        />
      ) : (
        <UploadDropzone
          hint="PNG, JPEG ou WebP · 2 Mo max · 512 px de large minimum · fond transparent recommandé. Pas de SVG."
          accept="image/png,image/jpeg,image/webp"
          onFileSelected={selectFile}
        />
      )}

      <Button type="button" variant="outline" size="lg" className="w-full" onClick={close}>
        Fermer
      </Button>
    </div>
  );
}
