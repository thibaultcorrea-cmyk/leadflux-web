import { FilePen, MessageSquare, Send, Users } from "lucide-react";
import { KpiItem } from "../entities/type";



export const kpis: KpiItem[] = [
  {
    id: "prospects-sources",
    label: "Prospects sourcés",
    value: 248,
    hint: "+32",
    type: "number",

  },
  {
    id: "brouillons",
    label: "Brouillons à valider",
    value: 17,
    hint: "Action requise",
    type: "action",

  },
  {
    id: "emails-envoyes",
    label: "Emails envoyés",
    value: 96,
    hint: "+14",
    type: "number",
  },
  {
    id: "reponses",
    label: "Réponses reçues",
    value: 12,
    hint: "12,5 %",
    type: "percentage",
  },
];
