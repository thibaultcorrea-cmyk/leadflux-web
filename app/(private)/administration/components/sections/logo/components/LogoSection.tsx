import { Image as ImageIcon, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logoMock } from "../../../../services/logo-mock";
import { LogoPreviewSwatch } from "./LogoPreviewSwatch";

/**
 * Corps de la section "Logo de l'entreprise" (maquette "Logo Card") :
 * aperçus sur fond sombre/clair, fichier actuel et actions. Ni "Remplacer
 * le logo" (upload — dépend d'Uppy, pas encore intégré, cf. section Base de
 * connaissances) ni "Supprimer" (pas de stockage branché) ne sont câblés
 * pour l'instant.
 */
export function LogoSection() {
  const logo = logoMock.getCurrentLogo();

  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-card p-6 sm:flex-row">
      <div className="flex shrink-0 gap-3">
        <LogoPreviewSwatch variant="dark" caption="Sur fond sombre" />
        <LogoPreviewSwatch variant="light" caption="Sur fond clair" />
      </div>

      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-50">
            <ImageIcon className="size-[18px] text-primary-700" aria-hidden />
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-ink-900">{logo.name}</p>
            <p className="text-xs text-ink-500">
              {logo.widthPx.toLocaleString("fr-FR")} × {logo.heightPx.toLocaleString("fr-FR")} px ·{" "}
              {logo.sizeLabel} · {logo.hasTransparentBackground ? "fond transparent" : "fond opaque"} ·
              importé le {logo.uploadedAtLabel}
            </p>
          </div>
        </div>

        <p className="text-xs leading-normal text-ink-500">
          PNG, JPEG ou WebP · 2 Mo max · 512 px de large minimum · fond transparent recommandé.
          Pas de SVG.
        </p>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="lg" className="h-10 gap-2 px-4 text-sm font-medium text-ink-900">
            <Upload className="size-[15px]" aria-hidden />
            Remplacer le logo
          </Button>
          <Button type="button" variant="outline" size="lg" className="h-10 gap-2 px-4 text-sm font-medium text-ink-900">
            <Trash2 className="size-[15px]" aria-hidden />
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}
