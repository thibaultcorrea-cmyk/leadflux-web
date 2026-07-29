/** Colonne Entreprise : c'est l'entrée principale de la ligne, donc le seul texte en medium. */
export function CompanyCell({ company }: { company: string }) {
  return (
    <span className="text-sm font-medium text-ink-900">{company}</span>
  );
}
