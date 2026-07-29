/** Cellule texte simple (Ville, Taille) : une seule définition pour un rendu homogène. */
export function TextCell({ value }: { value: string }) {
  return <span className="text-[13px] text-ink-700">{value}</span>;
}
