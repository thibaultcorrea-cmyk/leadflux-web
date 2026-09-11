import { CloudUpload } from "lucide-react";

type UploadDropzoneProps = {
  hint: string;
};

/**
 * Dropzone purement visuelle, réutilisée par les sections Base de
 * connaissances et Logo de l'entreprise. L'upload réel (Uppy — @uppy/core,
 * @uppy/dashboard, @uppy/react) est installé mais volontairement pas encore
 * intégré : le stockage n'est pas tranché (CLAUDE.md §4 et §8.5).
 * Sélectionner un fichier ici ne déclenche donc encore rien.
 */
export function UploadDropzone({ hint }: UploadDropzoneProps) {
  return (
    <div className="flex h-44 w-full flex-col items-center justify-center gap-2.5 rounded-lg border border-ink-300 bg-background-100">
      <span className="flex size-11 items-center justify-center rounded-full bg-accent-50">
        <CloudUpload className="size-5.5 text-accent-700" aria-hidden />
      </span>
      <span className="flex items-center gap-1 text-[15px]">
        <span className="font-medium text-ink-900">Glissez votre fichier ici, ou</span>
        <span className="font-semibold text-accent-700">parcourir vos fichiers</span>
      </span>
      <span className="text-xs text-ink-500">{hint}</span>
    </div>
  );
}
