export type KnowledgeBaseFileType = "pdf" | "docx" | "md" | "txt";

export type KnowledgeBaseFile = {
  name: string;
  type: KnowledgeBaseFileType;
  sizeLabel: string;
  uploadedAtLabel: string;
  wordCount: number;
  /** Fichier source à afficher dans l'aperçu PDF (react-pdf). */
  previewUrl?: string;
  /** Texte extrait, servi à l'indexation — utilisé pour l'aperçu Markdown/texte brut. */
  extractedText: string;
};

export type KnowledgeBaseVersion = {
  number: number;
  indexedAtLabel: string;
  author: string;
};

export type KnowledgeBaseIndexStats = {
  passagesIndexed: number;
  reindexedAtLabel: string;
};
