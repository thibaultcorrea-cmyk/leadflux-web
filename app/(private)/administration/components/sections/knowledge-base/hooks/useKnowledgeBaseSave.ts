"use client";

import { useState } from "react";

import { toast } from "@/lib/toaster";
import { waitDelay } from "@/lib/utils";
import type { KnowledgeBaseIndexStats } from "../../../../types/knowledge-base";

type KnowledgeBaseSaveStatus = "idle" | "saving";

const PROGRESS_STEPS = [15, 35, 60, 82, 100];
const STEP_DELAY_MS = 300;

/**
 * Simule l'enregistrement + réindexation d'une nouvelle version de la base
 * de connaissances : aucune API n'est branchée (cf. knowledge-base-mock.ts,
 * stockage du PDF non tranché — CLAUDE.md §4/§8.5). Le seul rôle de ce hook
 * est d'exposer assez d'état pour que l'UI bascule entre les stats
 * d'indexation et une barre de progression pendant l'opération.
 */
export function useKnowledgeBaseSave(initialStats: KnowledgeBaseIndexStats) {
  const [status, setStatus] = useState<KnowledgeBaseSaveStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState(initialStats);

  const save = async () => {
    if (status === "saving") return;

    setStatus("saving");
    setProgress(0);

    for (const step of PROGRESS_STEPS) {
      await waitDelay(STEP_DELAY_MS);
      setProgress(step);
    }

    setStats((current) => ({
      ...current,
      reindexedAtLabel: "à l'instant",
    }));
    setStatus("idle");
    toast.success({
      title: "Base de connaissances réindexée",
      description: "La nouvelle version est prise en compte pour les prochains emails générés.",
    });
  };

  return { status, progress, stats, save };
}
