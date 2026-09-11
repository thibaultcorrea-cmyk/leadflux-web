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
  sizeLabel: "38 Ko",
  uploadedAtLabel: "3 juillet 2026",
  hasTransparentBackground: true,
};

export const logoMock = {
  getCurrentLogo: (): LogoFile => mockLogoFile,
};
