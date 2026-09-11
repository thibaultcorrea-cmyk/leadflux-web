import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { UploadDropzone } from "../../../shared/UploadDropzone";

/**
 * Contenu de la modale "Remplacer le logo". La zone d'upload reste
 * purement visuelle (Uppy installé mais pas encore intégré, cf. section
 * Base de connaissances) : "Remplacer" n'a pas encore de fichier réel à
 * envoyer.
 */
export function ReplaceLogoModal() {
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

      <UploadDropzone hint="PNG, JPEG ou WebP · 2 Mo max · 512 px de large minimum · fond transparent recommandé. Pas de SVG." />

      <div className="flex justify-end">
        <Button type="button" size="lg" className="h-10 gap-2 px-4 text-sm font-semibold">
          <Upload className="size-[15px]" aria-hidden />
          Remplacer
        </Button>
      </div>
    </div>
  );
}
