import { formatRelativeTime } from "@/lib/date-format";

/**
 * Colonne Dernière activité. Le libellé relatif est affiché, la date exacte
 * reste disponible au survol — « Hier » ne dit pas quel jour.
 */
export function ActivityCell({ isoDate }: { isoDate: string }) {
  return (
    <time
      dateTime={isoDate}
      title={new Date(isoDate).toLocaleString("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
      })}
      className="text-[13px] text-ink-700"
    >
      <RenderTimeAgo isoDate={isoDate} />

    </time>
  );
}


const RenderTimeAgo = ({ isoDate }: { isoDate: Date | string }) => {
  const relativeTime = formatRelativeTime(isoDate)

  if (relativeTime.includes('instant')) {
    return `à l\'instant`
  }

  return `Il y a ${relativeTime}`
}