
import { FilePen, LucideIcon, MessageSquare, Percent, Send, Users } from "lucide-react";
import { KpiEmailKey } from "../types/tableau";


export const kpisIconsMap: Record<KpiEmailKey, LucideIcon> = {
    "totalProspects": Users,
    "drafted": FilePen,
    "sent": Send,
    "replied": MessageSquare,
    "repliedRate": Percent
}

export const DEFAULT_FUNNEL_STEP = [
    {
        "id": "sources",
        "label": "Prospects sourcés",
        "value": 0,
        "tone": "neutral"
    },
    {
        "id": "brouillons",
        "label": "Brouillons générés",
        "value": 0,
        "tone": "neutral"
    },
    {
        "id": "envoyes",
        "label": "Validés et envoyés",
        "value": 0,
        "tone": "accent"
    },
    {
        "id": "reponses",
        "label": "Réponses reçues",
        "value": 0,
        "tone": "success"
    }
]