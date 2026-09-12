"use client";

import { CloudUpload } from "lucide-react";
import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";

type UploadDropzoneProps = {
  hint: string;
  accept?: string;
  disabled?: boolean;
  onFileSelected: (file: File) => void;
};

/**
 * Dropzone reutilisee par les sections Base de connaissances et Logo de
 * l'entreprise. Le clic (et Entree/Espace au clavier) ouvrent le meme
 * selecteur de fichier que le glisser-deposer : WCAG 2.2 (dragging
 * movements) exige une alternative au pointeur pour toute action de
 * glisser-deposer, jamais le drag comme seul moyen de selectionner un
 * fichier.
 */
export function UploadDropzone({ hint, accept, disabled, onFileSelected }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const openFilePicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    const file = event.dataTransfer.files[0];
    if (file) onFileSelected(file);
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={openFilePicker}
      onKeyDown={handleKeyDown}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`flex h-44 w-full flex-col items-center justify-center gap-2.5 rounded-lg border transition-colors ${
        disabled
          ? "cursor-not-allowed border-ink-300 bg-background-100 opacity-60"
          : isDragOver
            ? "cursor-pointer border-accent-500 bg-accent-50"
            : "cursor-pointer border-ink-300 bg-background-100 hover:border-accent-300"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept}
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFileSelected(file);
          event.target.value = "";
        }}
      />
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
