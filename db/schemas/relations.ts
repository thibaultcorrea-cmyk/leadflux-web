import { relations } from "drizzle-orm";
import { sectors } from "./sectors";
import { addresses } from "./addresses";
import { companies } from "./companies";
import { keywords, companyKeywords } from "./keywords";
import { technologies, companyTechnologies } from "./technologies";
import { persons } from "./persons";
import { prospects } from "./prospects";
import { searches, searchResults } from "./searches";
import { user } from "./authSchema";

/**
 * Toutes les relations du domaine sont declarees ici plutot qu'au bas de chaque
 * fichier de table (convention de authSchema.ts, qui reste valable car ce
 * fichier-la est autonome).
 *
 * Raison : prospects et search_results se referencent mutuellement. Declarer
 * leurs relations dans leurs fichiers respectifs creerait un cycle d'imports ;
 * les regrouper ici l'evite completement, aucune table n'important ce fichier.
 */

export const sectorRelations = relations(sectors, ({ many }) => ({
  companies: many(companies),
}));

export const addressRelations = relations(addresses, ({ many }) => ({
  companies: many(companies),
}));

export const companyRelations = relations(companies, ({ one, many }) => ({
  sector: one(sectors, {
    fields: [companies.sectorId],
    references: [sectors.id],
  }),
  address: one(addresses, {
    fields: [companies.addressId],
    references: [addresses.id],
  }),
  prospects: many(prospects),
  companyKeywords: many(companyKeywords),
  companyTechnologies: many(companyTechnologies),
}));

export const keywordRelations = relations(keywords, ({ many }) => ({
  companyKeywords: many(companyKeywords),
}));

export const companyKeywordRelations = relations(companyKeywords, ({ one }) => ({
  company: one(companies, {
    fields: [companyKeywords.companyId],
    references: [companies.id],
  }),
  keyword: one(keywords, {
    fields: [companyKeywords.keywordId],
    references: [keywords.id],
  }),
}));

export const technologyRelations = relations(technologies, ({ many }) => ({
  companyTechnologies: many(companyTechnologies),
}));

export const companyTechnologyRelations = relations(
  companyTechnologies,
  ({ one }) => ({
    company: one(companies, {
      fields: [companyTechnologies.companyId],
      references: [companies.id],
    }),
    technology: one(technologies, {
      fields: [companyTechnologies.technologyId],
      references: [technologies.id],
    }),
  }),
);

export const personRelations = relations(persons, ({ many }) => ({
  prospects: many(prospects),
}));

export const prospectRelations = relations(prospects, ({ one, many }) => ({
  person: one(persons, {
    fields: [prospects.personId],
    references: [persons.id],
  }),
  company: one(companies, {
    fields: [prospects.companyId],
    references: [companies.id],
  }),
  searchResults: many(searchResults),
}));

export const searchRelations = relations(searches, ({ one, many }) => ({
  creator: one(user, {
    fields: [searches.createdBy],
    references: [user.id],
  }),
  results: many(searchResults),
}));

export const searchResultRelations = relations(searchResults, ({ one }) => ({
  search: one(searches, {
    fields: [searchResults.searchId],
    references: [searches.id],
  }),
  prospect: one(prospects, {
    fields: [searchResults.prospectId],
    references: [prospects.id],
  }),
}));
