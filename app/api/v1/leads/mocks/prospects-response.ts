/**
 * Jeu de données de démonstration au format de la réponse API `prospects`.
 *
 * Dérivé de `./prospects.ts` (données de la maquette « Recherche — Résultats »),
 * restructuré pour coller à la forme retournée par la query GraphQL :
 * company.address, company.sector, person, lastSourcedAt.
 */

export type ProspectAddress = {
  city: string;
  country: string;
};

export type ProspectSector = {
  name: string;
};

export type ProspectCompany = {
  name: string;
  address: ProspectAddress;
  description: string;
  headcountMin: number;
  headcountMax: number;
  industry: ProspectSector;
};

export type ProspectPerson = {
  jobTitle: string;
  linkedinUrl: string;
  fullName: string;
};

export type ProspectApiItem = {
  id: string;
  company: ProspectCompany;
  person: ProspectPerson;
  lastSourcedAt: string;
};

export const prospectsResponse: ProspectApiItem[] = [
  {
    id: "p-01",
    company: {
      name: "Aubert Stratégie",
      address: { city: "Dijon", country: "France" },
      description:
        "Cabinet de conseil en stratégie et transformation pour dirigeants de PME.",
      headcountMin: 3,
      headcountMax: 8,
      sector: { name: "Conseil" },
    },
    person: {
      jobTitle: "Directeur associé",
      linkedinUrl: "https://www.linkedin.com/in/marion-aubert",
      fullName: "Marion Aubert",
    },
    lastSourcedAt: "2026-07-28T09:12:00.000Z",
  },
  {
    id: "p-02",
    company: {
      name: "Altitude Conseil Bordeaux",
      address: { city: "Bordeaux", country: "France" },
      description:
        "Conseil en performance opérationnelle pour entreprises de services.",
      headcountMin: 3,
      headcountMax: 8,
      sector: { name: "Conseil" },
    },
    person: {
      jobTitle: "Fondatrice",
      linkedinUrl: "https://www.linkedin.com/in/sophie-simon",
      fullName: "Sophie Simon",
    },
    lastSourcedAt: "2026-07-28T09:12:00.000Z",
  },
  {
    id: "p-03",
    company: {
      name: "Simon Stratégie",
      address: { city: "Bordeaux", country: "France" },
      description:
        "Cabinet de conseil en stratégie d'entreprise auprès de dirigeants du Sud-Ouest.",
      headcountMin: 8,
      headcountMax: 15,
      sector: { name: "Conseil" },
    },
    person: {
      jobTitle: "Associé fondateur",
      linkedinUrl: "https://www.linkedin.com/in/hugo-simon",
      fullName: "Hugo Simon",
    },
    lastSourcedAt: "2026-07-28T09:12:00.000Z",
  },
  {
    id: "p-04",
    company: {
      name: "Bernard BtoB",
      address: { city: "Bordeaux", country: "France" },
      description:
        "Prestataire de services BtoB spécialisé dans l'externalisation commerciale.",
      headcountMin: 8,
      headcountMax: 15,
      sector: { name: "Services BtoB" },
    },
    person: {
      jobTitle: "Directrice générale",
      linkedinUrl: "https://www.linkedin.com/in/pierre-bernard",
      fullName: "Pierre Bernard",
    },
    lastSourcedAt: "2026-07-27T15:40:00.000Z",
  },
  {
    id: "p-05",
    company: {
      name: "Dubois BtoB",
      address: { city: "Dijon", country: "France" },
      description:
        "Services BtoB pour PME industrielles : administratif, achats et logistique.",
      headcountMin: 8,
      headcountMax: 15,
      sector: { name: "Services BtoB" },
    },
    person: {
      jobTitle: "Directrice des ventes",
      linkedinUrl: "https://www.linkedin.com/in/mathieu-dubois",
      fullName: "Mathieu Dubois",
    },
    lastSourcedAt: "2026-07-27T15:40:00.000Z",
  },
  {
    id: "p-06",
    company: {
      name: "Dubois Management de Transition",
      address: { city: "Rouen", country: "France" },
      description:
        "Management de transition pour directions financières et opérationnelles.",
      headcountMin: 8,
      headcountMax: 15,
      sector: { name: "Management de transition" },
    },
    person: {
      jobTitle: "Associée",
      linkedinUrl: "https://www.linkedin.com/in/mathieu-dubois-transition",
      fullName: "Mathieu Dubois",
    },
    lastSourcedAt: "2026-07-27T15:40:00.000Z",
  },
  {
    id: "p-07",
    company: {
      name: "Robert Management de Transition",
      address: { city: "Strasbourg", country: "France" },
      description:
        "Cabinet de management de transition intervenant sur des missions courtes en PME.",
      headcountMin: 3,
      headcountMax: 8,
      sector: { name: "Management de transition" },
    },
    person: {
      jobTitle: "Associée",
      linkedinUrl: "https://www.linkedin.com/in/laura-robert",
      fullName: "Laura Robert",
    },
    lastSourcedAt: "2026-07-26T11:05:00.000Z",
  },
  {
    id: "p-08",
    company: {
      name: "Altitude Conseil Paris",
      address: { city: "Paris", country: "France" },
      description:
        "Conseil indépendant en stratégie de croissance pour dirigeants d'ETI.",
      headcountMin: 1,
      headcountMax: 1,
      sector: { name: "Conseil" },
    },
    person: {
      jobTitle: "Directeur associé",
      linkedinUrl: "https://www.linkedin.com/in/clara-girard",
      fullName: "Clara Girard",
    },
    lastSourcedAt: "2026-07-26T11:05:00.000Z",
  },
  {
    id: "p-09",
    company: {
      name: "Lemoine & Associés",
      address: { city: "Lyon", country: "France" },
      description:
        "Cabinet de conseil pluridisciplinaire accompagnant la transformation des PME régionales.",
      headcountMin: 15,
      headcountMax: 30,
      sector: { name: "Conseil" },
    },
    person: {
      jobTitle: "Président",
      linkedinUrl: "https://www.linkedin.com/in/nicolas-lemoine",
      fullName: "Nicolas Lemoine",
    },
    lastSourcedAt: "2026-07-26T11:05:00.000Z",
  },
  {
    id: "p-10",
    company: {
      name: "Garnier Formation",
      address: { city: "Nantes", country: "France" },
      description:
        "Organisme de formation professionnelle certifié Qualiopi pour salariés et dirigeants.",
      headcountMin: 3,
      headcountMax: 8,
      sector: { name: "Formation" },
    },
    person: {
      jobTitle: "Directrice générale",
      linkedinUrl: "https://www.linkedin.com/in/elise-garnier",
      fullName: "Élise Garnier",
    },
    lastSourcedAt: "2026-07-25T08:30:00.000Z",
  },
  {
    id: "p-11",
    company: {
      name: "Petit Conseil RH",
      address: { city: "Lille", country: "France" },
      description:
        "Conseil RH indépendant : recrutement, marque employeur et organisation du travail.",
      headcountMin: 1,
      headcountMax: 1,
      sector: { name: "Conseil RH" },
    },
    person: {
      jobTitle: "Fondateur",
      linkedinUrl: "https://www.linkedin.com/in/antoine-petit",
      fullName: "Antoine Petit",
    },
    lastSourcedAt: "2026-07-25T08:30:00.000Z",
  },
  {
    id: "p-12",
    company: {
      name: "Moreau Transition",
      address: { city: "Toulouse", country: "France" },
      description:
        "Management de transition sur des missions de direction opérationnelle en PME.",
      headcountMin: 8,
      headcountMax: 15,
      sector: { name: "Management de transition" },
    },
    person: {
      jobTitle: "Associée",
      linkedinUrl: "https://www.linkedin.com/in/julie-moreau",
      fullName: "Julie Moreau",
    },
    lastSourcedAt: "2026-07-25T08:30:00.000Z",
  },
  {
    id: "p-13",
    company: {
      name: "Fontaine Services",
      address: { city: "Marseille", country: "France" },
      description:
        "Services BtoB aux entreprises du secteur logistique et portuaire.",
      headcountMin: 15,
      headcountMax: 30,
      sector: { name: "Services BtoB" },
    },
    person: {
      jobTitle: "Directeur commercial",
      linkedinUrl: "https://www.linkedin.com/in/karim-fontaine",
      fullName: "Karim Fontaine",
    },
    lastSourcedAt: "2026-07-24T14:20:00.000Z",
  },
  {
    id: "p-14",
    company: {
      name: "Roussel Formation",
      address: { city: "Rennes", country: "France" },
      description:
        "Formation continue des cadres et dirigeants, en présentiel et à distance.",
      headcountMin: 3,
      headcountMax: 8,
      sector: { name: "Formation" },
    },
    person: {
      jobTitle: "Directrice pédagogique",
      linkedinUrl: "https://www.linkedin.com/in/camille-roussel",
      fullName: "Camille Roussel",
    },
    lastSourcedAt: "2026-07-24T14:20:00.000Z",
  },
  {
    id: "p-15",
    company: {
      name: "Chevalier Conseil",
      address: { city: "Grenoble", country: "France" },
      description:
        "Conseil en organisation et pilotage de la performance pour PME industrielles.",
      headcountMin: 8,
      headcountMax: 15,
      sector: { name: "Conseil" },
    },
    person: {
      jobTitle: "Associé",
      linkedinUrl: "https://www.linkedin.com/in/paul-chevalier",
      fullName: "Paul Chevalier",
    },
    lastSourcedAt: "2026-07-24T14:20:00.000Z",
  },
  {
    id: "p-16",
    company: {
      name: "Barbier RH",
      address: { city: "Montpellier", country: "France" },
      description:
        "Conseil RH à destination des TPE : paie, contrats et accompagnement managérial.",
      headcountMin: 1,
      headcountMax: 1,
      sector: { name: "Conseil RH" },
    },
    person: {
      jobTitle: "Fondatrice",
      linkedinUrl: "https://www.linkedin.com/in/sarah-barbier",
      fullName: "Sarah Barbier",
    },
    lastSourcedAt: "2026-07-23T10:00:00.000Z",
  },
];

export default prospectsResponse;
