"use client";

import type { ColumnFiltersState } from "@tanstack/react-table";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useMemo } from "react";

import type { StatusFilterItem } from "@/components/shared/tables/data-table-status-filter";
import {
  EMAIL_STATUS_FILTERS,
  type Email,
  type EmailStatusFilter,
} from "../types/email";

const FILTER_LABELS: Record<EmailStatusFilter, string> = {
  tous: "Tous",
  draft: "Brouillons à valider",
  sent: "Validés et envoyés",
  replied: "A répondu",
};

/**
 * Filtre de statut de l'onglet Emails, stocké dans l'URL (`?statut=brouillon`).
 *
 * Passer par l'URL plutôt que par un `useState` a trois effets concrets : une
 * vue filtrée se partage par lien, le rechargement la conserve, et le bouton
 * Précédent revient au filtre précédent au lieu de quitter la page.
 */
export function useEmailStatusFilter(emails: Email[]) {
  const [status, setStatus] = useQueryState(
    "statut",
    parseAsStringLiteral(EMAIL_STATUS_FILTERS)
      .withDefault("tous")
      // `tous` est l'état par défaut : il n'a pas à salir l'URL.
      .withOptions({ clearOnDefault: true, history: "push" })
  );

  const counts = useMemo(() => {
    const byStatus = { draft: 0, sent: 0, replied: 0 };
    for (const email of emails) byStatus[email.status] += 1;
    return { tous: emails.length, ...byStatus };
  }, [emails]);

  const items: StatusFilterItem<EmailStatusFilter>[] = EMAIL_STATUS_FILTERS.map(
    (value) => ({ value, label: FILTER_LABELS[value], count: counts[value] })
  );

  // Le filtre est appliqué par TanStack Table sur la colonne `status`, jamais en
  // filtrant le tableau de données en amont : les compteurs ci-dessus restent
  // ceux de l'ensemble, et la sélection multiple garde ses identifiants.
  const columnFilters: ColumnFiltersState =
    status === "tous" ? [] : [{ id: "status", value: status }];

  return { status, setStatus, items, columnFilters };
}
