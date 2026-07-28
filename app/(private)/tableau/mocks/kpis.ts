import { FilePen, MessageSquare, Send, Users } from "lucide-react";

import type { Kpi } from "../types/tableau";

export const kpis: Kpi[] = [
  {
    id: "prospects-sources",
    label: "Prospects sourcés",
    value: "248",
    hint: "+32 sur 7 jours",
    icon: Users,
  },
  {
    id: "brouillons",
    label: "Brouillons à valider",
    value: "17",
    hint: "Action requise",
    icon: FilePen,
  },
  {
    id: "emails-envoyes",
    label: "Emails envoyés",
    value: "96",
    hint: "+14 sur 7 jours",
    icon: Send,
  },
  {
    id: "reponses",
    label: "Réponses reçues",
    value: "12",
    hint: "Taux de réponse 12,5 %",
    icon: MessageSquare,
  },
];
