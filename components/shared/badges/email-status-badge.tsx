import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Statut d'un email, par prospect. Ce sont les trois seuls statuts du produit :
 * aucun envoi n'est automatique, donc ni « envoi en cours » ni taux d'envoi
 * (CLAUDE.md §3).
 */
export type EmailStatus = "draft" | "sent" | "replied";

export const EMAIL_STATUS_LABELS: Record<EmailStatus, string> = {
  draft: "Brouillon à valider",
  sent: "Validé et envoyé",
  replied: "A répondu",
};

const STATUS_CLASSNAMES: Record<EmailStatus, string> = {
  draft: "bg-accent-50 text-accent-700",
  sent: "bg-primary-50 text-primary-700",
  replied: "bg-success-50 text-success",
};

/**
 * Le statut est toujours écrit en toutes lettres : la couleur seule ne doit
 * jamais porter l'information.
 */
export function EmailStatusBadge({
  status,
  className,
}: {
  status: EmailStatus;
  className?: string;
}) {
  return (
    <Badge
      className={cn(
        "h-auto px-2.5 py-1 text-xs",
        STATUS_CLASSNAMES[status],
        className
      )}
    >
      {EMAIL_STATUS_LABELS[status]}
    </Badge>
  );
}
