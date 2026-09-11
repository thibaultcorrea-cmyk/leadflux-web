type AdminSectionShellProps = {
  id: string;
  title: string;
  description?: string;
  /** Emplacement à droite du titre (ex. badge de version), cf. maquette "Section Header". */
  headerAction?: React.ReactNode;
  children?: React.ReactNode;
};

/**
 * Squelette générique d'une section de la page Administration : ancre,
 * titre, description optionnelle et emplacement d'action d'en-tête. Le
 * contenu de chaque section est ajouté via `children`, section par section,
 * sans jamais modifier ce composant.
 */
export function AdminSectionShell({
  id,
  title,
  description,
  headerAction,
  children,
}: AdminSectionShellProps) {
  return (
    <section id={id} className="flex scroll-mt-16 flex-col gap-4 md:scroll-mt-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="font-display text-[28px] leading-none tracking-[0.01em] text-primary-700">
            {title}
          </h2>
          {description && (
            <p className="max-w-[62ch] text-sm leading-normal text-ink-500">{description}</p>
          )}
        </div>
        {headerAction}
      </div>
      {children}
    </section>
  );
}
