import type { LucideIcon } from "lucide-react";

/**
 * Statut d'un email, par prospect. Ce sont les trois seuls statuts du produit :
 * aucun envoi n'est automatique, donc pas de notion de "taux d'envoi"
 * (cf. CLAUDE.md §3).
 */
export type EmailStatus = "brouillon" | "envoye" | "repondu";

export type Kpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
};

export type RecentActivityRow = {
  id: string;
  prospect: string;
  company: string;
  status: EmailStatus;
  activityLabel: string;
};

export type FunnelStep = {
  id: string;
  label: string;
  value: number;
  /** Ton de la barre : la dernière étape et l'étape d'envoi se distinguent. */
  tone: "neutral" | "accent" | "success";
};

export type SavedSearch = {
  id: string;
  name: string;
  criteria: string;
  count: number;
};
