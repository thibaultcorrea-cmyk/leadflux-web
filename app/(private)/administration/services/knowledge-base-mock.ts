import type {
  KnowledgeBaseFile,
  KnowledgeBaseIndexStats,
  KnowledgeBaseVersion,
} from "../types/knowledge-base";

/**
 * Aucune API de base de connaissances n'est branchée : ces données
 * reproduisent la maquette "Administration — Variante A" pour que l'UI
 * puisse être construite dès maintenant. À remplacer par un vrai service une
 * fois l'upload (Uppy) et le stockage du PDF de connaissance tranchés
 * (CLAUDE.md §4 et §8.5).
 */
const mockKnowledgeBaseFile: KnowledgeBaseFile = {
  name: "base-connaissance-oxiagen-v3.pdf",
  type: "pdf",
  sizeLabel: "42 Ko",
  uploadedAtLabel: "12 août 2026",
  wordCount: 1480,
  previewUrl: "/mocks/base-connaissance-oxiagen-v3.pdf",
  extractedText:
    "Base de connaissance OxIAgen\n\n" +
    "Identité : OxIAgen aide les PME et solopreneurs à prospecter en B2B grâce " +
    "à un agent qui source des leads, rédige des emails personnalisés et " +
    "laisse toujours un humain valider avant tout envoi.\n\n" +
    "Offre : Leadflux, agent de prospection commercialisable, sourcing de " +
    "leads B2B, rédaction d'emails et validation humaine avant envoi.\n\n" +
    "Cible (ICP) : PME structurées ou solopreneurs qualifiés, secteur B2B, " +
    "décideur commercial ou dirigeant.",
};

const mockKnowledgeBaseVersion: KnowledgeBaseVersion = {
  number: 3,
  indexedAtLabel: "12 août 2026",
  author: "Thibault",
};

const mockKnowledgeBaseIndexStats: KnowledgeBaseIndexStats = {
  passagesIndexed: 38,
  reindexedAtLabel: "12 août 2026 à 14:32",
};

export const knowledgeBaseMock = {
  getCurrentFile: (): KnowledgeBaseFile => mockKnowledgeBaseFile,
  getCurrentVersion: (): KnowledgeBaseVersion => mockKnowledgeBaseVersion,
  getIndexStats: (): KnowledgeBaseIndexStats => mockKnowledgeBaseIndexStats,
};
