/** Colonne Prospect : nom du décideur au-dessus, entreprise en dessous. */
export function ProspectCell({
  name,
  company,
}: {
  name: string;
  company: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-medium text-ink-900">{name}</span>
      <span className="text-xs text-ink-500">{company}</span>
    </div>
  );
}
