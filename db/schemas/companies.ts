import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { sectors } from "./sectors";
import { addresses } from "./addresses";

/**
 * Entreprise sourcee. Porte l'identite de l'entreprise, jamais l'etat de
 * prospection : celui-ci vit sur la table racine prospects.
 *
 * Deux champs de la source sont stockes en double, brut et normalise, parce que
 * la source est bruitee et hors de notre controle :
 *  - industry ("Conseil (strategie, RH, IA)") -> industry_raw + sector_id
 *  - size ("3-8 employes")                    -> size_raw + headcount_min/max
 * La normalisation se fait a l'ingestion ; si la regle change, on rejoue depuis
 * prospects.raw_payload.
 */
export const companies = pgTable(
  "companies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    /** name normalise : moitie de la cle de dedup. */
    nameKey: text("name_key").notNull(),
    /**
     * Ville normalisee, denormalisee depuis l'adresse pour porter la contrainte
     * d'unicite. Sans elle, « Altitude Conseil » Bordeaux et Paris fusionneraient.
     */
    cityKey: text("city_key"),
    website: text("website"),
    description: text("description"),

    // --- Secteur : chaine brute conservee + reference canonique
    industryRaw: text("industry_raw"),
    sectorId: uuid("sector_id").references(() => sectors.id, {
      onDelete: "set null",
    }),

    // --- Taille : libelle source conserve, bornes numeriques pour le tri
    sizeRaw: text("size_raw"),
    /** Borne basse de la tranche : c'est elle qui trie la colonne Taille, jamais le libelle. */
    headcountMin: integer("headcount_min"),
    headcountMax: integer("headcount_max"),

    addressId: uuid("address_id").references(() => addresses.id, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    // nullsNotDistinct : deux entreprises homonymes sans ville connue doivent
    // entrer en conflit, pas creer deux lignes a chaque re-sourcing.
    unique("companies_name_city_unique")
      .on(table.nameKey, table.cityKey)
      .nullsNotDistinct(),
    index("companies_sector_id_idx").on(table.sectorId),
    index("companies_headcount_min_idx").on(table.headcountMin),
  ],
);
