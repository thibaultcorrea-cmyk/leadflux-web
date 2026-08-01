import type { EmailStatus } from "@/components/shared/badges/email-status-badge";
import { kpiSchema } from "../components/schema/kpisSchema";
import z from "zod";
import { SavedSearchItem } from "@/features/stats/entities/type";

// Le statut d'email est partagé avec l'onglet Emails : il vit dans le composant
// de badge commun plutôt que dans les types d'une page.
export type { EmailStatus } from "@/components/shared/badges/email-status-badge";

export type Kpi = z.infer<typeof kpiSchema>;

export type KpiApiReturn = Omit<Kpi, "icon">;

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

export type SavedSearchReturn = SavedSearchItem



