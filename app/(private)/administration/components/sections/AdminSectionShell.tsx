type AdminSectionShellProps = {
  id: string;
  title: string;
  children?: React.ReactNode;
};

/**
 * Squelette générique d'une section de la page Administration : ancre +
 * titre. Le contenu de chaque section sera ajouté via `children`, section
 * par section, sans jamais modifier ce composant.
 */
export function AdminSectionShell({ id, title, children }: AdminSectionShellProps) {
  return (
    <section id={id} className="scroll-mt-6">
      <h2 className="font-display text-[28px] leading-none tracking-[0.01em] text-primary-700">
        {title}
      </h2>
      {children}
    </section>
  );
}
