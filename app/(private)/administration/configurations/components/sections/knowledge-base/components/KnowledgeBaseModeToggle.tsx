"use client";

import { ClipboardPaste, FileUp } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type KnowledgeBaseMode = "file" | "paste";

type KnowledgeBaseModeToggleProps = {
  mode: KnowledgeBaseMode;
  onModeChange: (mode: KnowledgeBaseMode) => void;
};

/** Segmented control "Importer un fichier" / "Coller le texte" (maquette "Mode Segmented"). */
export function KnowledgeBaseModeToggle({ mode, onModeChange }: KnowledgeBaseModeToggleProps) {
  return (
    <ToggleGroup
      value={[mode]}
      onValueChange={(values) => {
        const next = values[0] as KnowledgeBaseMode | undefined;
        if (next) onModeChange(next);
      }}
      className="w-fit gap-1 rounded-md bg-background-200 p-1"
    >
      <ToggleGroupItem
        value="file"
        className="h-auto gap-2 rounded-[6px] px-3.5 py-1.5 text-[13px] font-semibold text-ink-700 data-pressed:bg-card data-pressed:text-ink-900 data-pressed:shadow-sm"
      >
        <FileUp className="size-3.5 text-primary-700" aria-hidden />
        Importer un fichier
      </ToggleGroupItem>
      <ToggleGroupItem
        value="paste"
        className="h-auto gap-2 rounded-[6px] px-3.5 py-1.5 text-[13px] font-medium text-ink-500 data-pressed:bg-card data-pressed:text-ink-900 data-pressed:shadow-sm"
      >
        <ClipboardPaste className="size-3.5" aria-hidden />
        Coller le texte
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
