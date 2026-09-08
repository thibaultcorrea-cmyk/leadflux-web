"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

/**
 * Bouton icône « copier » générique : copie `text` dans le presse-papier et
 * bascule brièvement l'icône en confirmation (Copy -> Check).
 */
export function CopyButton({ text, label = "Copier", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Presse-papier indisponible (permissions navigateur) : pas de
      // confirmation visuelle, l'utilisateur peut toujours sélectionner le
      // texte manuellement.
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={label}
            onClick={copy}
            className={cn("shrink-0", className)}
          />
        }
      >
        <span className="relative inline-flex size-3 items-center justify-center">
          <Copy
            aria-hidden
            className={`absolute size-3 transition-all duration-200 ${copied ? "scale-50 opacity-0" : "scale-100 opacity-100"
              }`}
          />
          <Check
            aria-hidden
            className={`absolute size-3 text-success transition-all duration-200 ${copied ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copié !" : label}</TooltipContent>
    </Tooltip>
  );
}
