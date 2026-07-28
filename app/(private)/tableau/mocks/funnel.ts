import type { FunnelStep } from "../types/tableau";

export const funnelSteps: FunnelStep[] = [
  {
    id: "sources",
    label: "Prospects sourcés",
    value: 248,
    tone: "neutral",
  },
  {
    id: "brouillons",
    label: "Brouillons générés",
    value: 113,
    tone: "neutral",
  },
  {
    id: "envoyes",
    label: "Validés et envoyés",
    value: 96,
    tone: "accent",
  },
  {
    id: "reponses",
    label: "Réponses reçues",
    value: 12,
    tone: "success",
  },
];
