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

/**
 * Exemple complet respectant les 6 blocs attendus (cf. "Rédiger une bonne
 * base de connaissance") : un titre par paragraphe, un fait par paragraphe,
 * le nom plutôt qu'un renvoi. Affiché tel quel dans la modale "Voir un
 * exemple complet", via le même rendu Markdown que l'aperçu de texte.
 */
const mockFormattingExample = `## Identité

OxIAgen conçoit des agents d'intelligence artificielle sur mesure pour les PME et les solopreneurs francophones.

OxIAgen a été fondée par Thibault Correa, qui pilote lui-même chaque agent déployé chez ses clients avant de le leur remettre.

## Offre

Leadflux est un agent de prospection commercialisable : il source des leads B2B, rédige un email personnalisé pour chacun, puis dépose ce brouillon dans Gmail pour validation humaine.

Le prix d'entrée de Leadflux est de 490 € par mois pour un volume de 200 prospects sourcés.

## Cible (ICP)

Leadflux cible les PME structurées de 10 à 50 salariés dans les secteurs B2B, en particulier les métiers de service (agences, cabinets, éditeurs de logiciels).

Le décideur visé est le dirigeant ou le responsable commercial, rarement un poste opérationnel isolé.

## Preuves

OxIAgen utilise Leadflux en interne depuis janvier 2026 pour sa propre prospection, avant même de le commercialiser.

Un client pilote a obtenu 12 rendez-vous qualifiés en un mois, avec un taux de réponse de 18 %.

## Ton

Leadflux tutoie ses interlocuteurs et va droit au but : jamais plus de 120 mots par email.

Les mots interdits sont « solution », « disruptif » et « écosystème ».

## Appel à l'action

Chaque email se termine par une seule demande : un créneau de 15 minutes dans la semaine, jamais un lien de calendrier générique.`;

export const knowledgeBaseMock = {
  getCurrentFile: (): KnowledgeBaseFile => mockKnowledgeBaseFile,
  getCurrentVersion: (): KnowledgeBaseVersion => mockKnowledgeBaseVersion,
  getIndexStats: (): KnowledgeBaseIndexStats => mockKnowledgeBaseIndexStats,
  getFormattingExample: (): string => mockFormattingExample,
};
