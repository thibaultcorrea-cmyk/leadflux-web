import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="text-lg font-semibold text-ink-900">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-semibold text-ink-900">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold text-ink-900">{children}</h3>,
  p: ({ children }) => <p className="text-sm leading-relaxed text-ink-700">{children}</p>,
  ul: ({ children }) => <ul className="list-disc space-y-1 pl-5 text-sm text-ink-700">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5 text-sm text-ink-700">{children}</ol>,
  strong: ({ children }) => <strong className="font-semibold text-ink-900">{children}</strong>,
  code: ({ children }) => (
    <code className="rounded bg-background-200 px-1 py-0.5 text-xs text-ink-900">{children}</code>
  ),
};

type MarkdownPreviewProps = {
  content: string;
};

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto rounded-lg border border-border bg-background-100 p-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
