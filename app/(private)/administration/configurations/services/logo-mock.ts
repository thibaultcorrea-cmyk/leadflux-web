import { formatLongDate } from "@/lib/date-format";
import { formatFileSize } from "@/lib/utils";
import type { LogoFile } from "../types/logo";

/**
 * Aucune API de logo client n'est branchée : ces données reproduisent la
 * maquette "Administration — Variante A" (section "Logo de l'entreprise").
 * À remplacer par un vrai service une fois l'upload (Uppy) intégré.
 */
const mockLogoFile: LogoFile = {
  name: "logo-oxiagen.png",
  widthPx: 1024,
  heightPx: 256,
  sizeLabel: formatFileSize(38_912),
  uploadedAtLabel: formatLongDate("2026-07-03"),
  hasTransparentBackground: true,
};

export const logoMock = {
  getCurrentLogo: (): LogoFile => mockLogoFile,
};
