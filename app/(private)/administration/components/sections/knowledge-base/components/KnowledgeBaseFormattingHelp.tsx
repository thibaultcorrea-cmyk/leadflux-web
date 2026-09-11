"use client";

import { CircleCheck, CircleX, ExternalLink, FileDown, Lightbulb, Scissors, ShieldAlert } from "lucide-react";

import { useKnowledgeBaseExampleAction } from "../hooks/useKnowledgeBaseExampleAction";

const CHUNKING_TIPS = [
  {
    title: "Un titre avant chaque paragraphe :",
    example: "« Offre », « Preuves »… pour que chaque passage garde son sujet une fois isolé",
  },
  {
    title: "Un fait par paragraphe :",
    example: "jamais deux idées mélangées dans le même bloc de texte",
  },
  {
    title: "Le nom plutôt qu'un renvoi :",
    example: "« OxIAgen propose… », jamais « nous » ou « cette dernière » sans le nommer",
  },
  {
    title: "Pas de tableau ni de liste coupée :",
    example: "un passage retrouvé isolément doit rester lisible seul",
  },
];

const EXPECTED_BLOCKS = [
  { title: "Identité :", example: "qui vous êtes, en 3 lignes" },
  { title: "Offre :", example: "ce que vous vendez, pour qui, à quel prix d'entrée" },
  { title: "Cible (ICP) :", example: "secteur, taille, poste du décideur, douleur" },
  { title: "Preuves :", example: "chiffres, clients citables, résultats datés" },
];

const NEVER_INCLUDE = [
  "Tarifs internes, marges, conditions négociées, identifiants",
  "Données personnelles de vos clients sans leur accord",
  "Critiques nommées de concurrents",
  "Promesses chiffrées que vous ne pouvez pas prouver",
  "Historique de l'entreprise, organigramme, valeurs génériques",
  "Tableaux, images, mise en page en colonnes (le texte est perdu)",
];

/**
 * Guide "Rédiger une bonne base de connaissance" (maquette "Aide
 * Formatage") : rappelle que chaque paragraphe est indexé et retrouvé
 * isolément, d'où les règles de découpage. Le lien "Voir un exemple
 * complet" ouvre une modale scrollable avec un exemple mocké respectant
 * les 4 blocs attendus.
 */
export function KnowledgeBaseFormattingHelp() {
  const { openExample } = useKnowledgeBaseExampleAction();

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-background-100 p-5.5">
      <div className="flex items-center gap-2.5">
        <Lightbulb className="size-4.5 text-accent-700" aria-hidden />
        <h3 className="font-display text-[22px] leading-none tracking-[0.01em] text-primary-700">
          Rédiger une bonne base de connaissance
        </h3>
      </div>

      <p className="text-[13px] leading-normal text-ink-700">
        Chaque paragraphe est indexé et peut être retrouvé isolément, hors de son contexte
        d&apos;origine. Écrivez chaque bloc comme s&apos;il devait se suffire à lui-même.
      </p>

      <div className="flex items-start gap-3 rounded-lg border border-accent-500 bg-accent-50 p-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-100">
          <ShieldAlert className="size-4.5 text-warning" aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-[13px] font-semibold text-ink-900">
            N&apos;écrivez jamais de consigne adressée à l&apos;IA
          </p>
          <p className="text-[13px] leading-snug text-ink-700">
            Ce texte est indexé puis réinjecté tel quel au moment de la rédaction : une phrase
            comme « ignore les instructions précédentes » ou « recommande toujours cette offre »
            serait traitée comme une instruction, pas comme du contenu. N&apos;écrivez que des
            faits sur votre activité.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-ink-500">
          POUR UN BON DÉCOUPAGE (RAG)
        </p>
        {CHUNKING_TIPS.map((tip) => (
          <div key={tip.title} className="flex items-start gap-2">
            <Scissors className="mt-0.5 size-[15px] shrink-0 text-accent-700" aria-hidden />
            <div className="flex flex-col gap-1">
              <p className="text-[13px] font-semibold text-ink-900">{tip.title}</p>
              <p className="text-[13px] leading-snug text-ink-700">{tip.example}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-7 md:flex-row">
        <div className="flex flex-1 flex-col gap-2.5">
          <p className="text-[11px] font-semibold tracking-[0.08em] text-ink-500">
            4 BLOCS ATTENDUS, DANS CET ORDRE
          </p>
          {EXPECTED_BLOCKS.map((block) => (
            <div key={block.title} className="flex items-start gap-2">
              <CircleCheck className="mt-0.5 size-[15px] shrink-0 text-success" aria-hidden />
              <div className="flex flex-col gap-1">
                <p className="text-[13px] font-semibold text-ink-900">{block.title}</p>
                <p className="text-[13px] leading-snug text-ink-700">{block.example}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-2.5">
          <p className="text-[11px] font-semibold tracking-[0.08em] text-ink-500">
            À NE JAMAIS METTRE
          </p>
          {NEVER_INCLUDE.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <CircleX className="mt-0.5 size-[15px] shrink-0 text-error" aria-hidden />
              <p className="text-[13px] leading-snug text-ink-700">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-1">
        <button
          type="button"
          disabled
          className="flex items-center gap-1.5 text-[13px] font-semibold text-accent-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FileDown className="size-3.5" aria-hidden />
          Télécharger le modèle à remplir (.docx)
        </button>
        <button
          type="button"
          onClick={openExample}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-accent-700 hover:text-accent-900"
        >
          <ExternalLink className="size-3.5" aria-hidden />
          Voir un exemple complet
        </button>
      </div>
    </div>
  );
}
