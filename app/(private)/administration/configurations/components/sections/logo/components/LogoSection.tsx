"use client";

import { Image as ImageIcon, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logoMock } from "../../../../services/logo-mock";
import { useReplaceLogoAction } from "../hooks/useReplaceLogoAction";
import { LogoPreviewSwatch } from "./LogoPreviewSwatch";
import LogoLightPreview from "./LogoLightPreview";
import { LogoFile } from "../../../../types/logo";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Corps de la section "Logo de l'entreprise" (maquette "Logo Card") :
 * aperçus sur fond sombre/clair, fichier actuel et actions. "Remplacer le
 * logo" ouvre une modale avec zone d'upload (cf. ReplaceLogoModal) ; là
 * aussi l'upload réel dépend d'Uppy, pas encore intégré (cf. section Base
 * de connaissances). "Supprimer" n'est pas câblé : pas de stockage branché.
 */
type LogoSectionProps = {
  currentLogo: LogoFile | undefined;
  isLoading: boolean;
}
export function LogoSection({ currentLogo, isLoading }: LogoSectionProps) {
  const logo = currentLogo;
  const { openReplaceLogo } = useReplaceLogoAction();
  if (isLoading) {
    return <LoadingLogoSection />
  }
  if (!logo && !isLoading) {
    return <div>
      <p>No logo uploaded</p>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-10 gap-2 px-4 text-sm font-medium text-ink-900"
        onClick={openReplaceLogo}
      >
        <Upload className="size-[15px]" aria-hidden />
        Remplacer le logo
      </Button>
    </div>
  }

  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-card p-6 sm:flex-row">
      <div className="flex shrink-0 gap-3">
        <LogoLightPreview src={logo.url} alt={logo.name} />
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
              {logo.sizeLabel} · importé le {logo.uploadedAtLabel}
            </p>
          </div>
        </div>

        <p className="text-xs leading-normal text-ink-500">
          PNG, JPEG ou WebP · 2 Mo max · fond transparent recommandé.
          Pas de SVG.
        </p>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-10 gap-2 px-4 text-sm font-medium text-ink-900"
            onClick={openReplaceLogo}
          >
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


export const LoadingLogoSection = () => {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 sm:flex-row">
      <Skeleton className="size-[50px]" />

      <div className="flex w-full flex-col gap-3">
        {
          [...Array(3)].map((_, i) => (
            <Skeleton key={i} className="size-full rounded h-3" />
          ))
        }



      </div>
    </div>
  );
}