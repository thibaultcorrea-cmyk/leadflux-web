import { Badge } from "@/components/ui/badge";
import type { EmailStatus } from "../types/tableau";

const STATUS_STYLES: Record<EmailStatus, { label: string; className: string }> =
  {
    brouillon: {
      label: "Brouillon à valider",
      className: "bg-accent-50 text-accent-700",
    },
    envoye: {
      label: "Validé et envoyé",
      className: "bg-primary-50 text-primary-700",
    },
    repondu: {
      label: "A répondu",
      className: "bg-success-50 text-success",
    },
  };

/**
 * Le statut est toujours écrit en toutes lettres : la couleur seule ne doit
 * jamais porter l'information.
 */
export function StatusBadge({ status }: { status: EmailStatus }) {
  const { label, className } = STATUS_STYLES[status];

  return (
    <Badge className={`h-auto px-2.5 py-1 text-xs ${className}`}>{label}</Badge>
  );
}
