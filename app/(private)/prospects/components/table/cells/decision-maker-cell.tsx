/**
 * Colonne Décideur : nom au-dessus, fonction en dessous. Deux informations
 * distinctes dans une seule cellule, hiérarchisées par la taille et la couleur.
 */
export function DecisionMakerCell({
  name,
  role,
}: {
  name: string;
  role: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[13px] text-ink-900">{name}</span>
      <span className="text-xs text-ink-500">{role}</span>
    </div>
  );
}
