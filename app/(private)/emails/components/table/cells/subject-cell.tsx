/**
 * Colonne Objet. L'objet peut être long : il est tronqué sur une ligne avec son
 * texte complet en `title`, plutôt que de faire respirer toute la ligne.
 */
export function SubjectCell({ subject }: { subject: string }) {
  return (
    <span
      title={subject}
      className="block truncate pr-3 text-[13px] text-ink-700"
    >
      {subject}
    </span>
  );
}
