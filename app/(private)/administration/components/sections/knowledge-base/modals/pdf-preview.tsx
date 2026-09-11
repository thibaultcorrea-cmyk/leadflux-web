"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Le worker pdf.js doit être configuré dans le module qui utilise
// react-pdf (documentation react-pdf pour Next.js / App Router).
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PAGE_WIDTH = 620;

type PdfPreviewProps = {
  url: string;
};

export function PdfPreview({ url }: PdfPreviewProps) {
  const [numPages, setNumPages] = useState(0);

  return (
    <div className="flex max-h-[60vh] flex-col items-center gap-3 overflow-y-auto rounded-lg border border-border bg-background-100 p-4">
      <Document
        file={url}
        onLoadSuccess={({ numPages: loadedPages }) => setNumPages(loadedPages)}
        loading={<Loader2 className="my-10 size-6 animate-spin text-ink-500" aria-hidden />}
        error={<p className="my-10 text-sm text-ink-500">Aperçu PDF indisponible.</p>}
      >
        <div className="flex flex-col gap-3">
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              width={PAGE_WIDTH}
              className="overflow-hidden rounded-md shadow-sm"
            />
          ))}
        </div>
      </Document>
    </div>
  );
}
