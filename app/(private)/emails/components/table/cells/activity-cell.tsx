/**
 * Colonne Dernière activité. Le libellé relatif est affiché, la date exacte
 * reste disponible au survol — « Hier » ne dit pas quel jour.
 */
export function ActivityCell({
  label,
  isoDate,
}: {
  label: string;
  isoDate: string;
}) {
  return (
    <time
      dateTime={isoDate}
      title={new Date(isoDate).toLocaleString("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
      })}
      className="text-[13px] text-ink-700"
    >
      {label}
    </time>
  );
}
