type PlainTextPreviewProps = {
  content: string;
};

/** DOCX et TXT n'ont pas de rendu dédié : le texte extrait est brut. */
export function PlainTextPreview({ content }: PlainTextPreviewProps) {
  return (
    <pre className="max-h-[60vh] overflow-y-auto rounded-lg border border-border bg-background-100 p-4 font-sans text-sm leading-relaxed whitespace-pre-wrap text-ink-700">
      {content}
    </pre>
  );
}
