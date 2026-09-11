"use client";

import type { ColumnFiltersState } from "@tanstack/react-table";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useMemo } from "react";

import type { StatusFilterItem } from "@/components/shared/tables/data-table-status-filter";
import {
  USER_STATUS_FILTERS,
  type UserAccount,
  type UserStatusFilter,
} from "../../../../types/user";

const FILTER_LABELS: Record<UserStatusFilter, string> = {
  tous: "Tous",
  active: "Actifs",
  pending: "Invitations en attente",
};

/**
 * Filtre de statut de la section Utilisateurs, stocké dans l'URL (`?statut=pending`).
 * Même logique que `useEmailStatusFilter` : une vue filtrée se partage par lien
 * et le filtre est appliqué par TanStack Table, jamais en amont sur les données.
 */
export function useUserStatusFilter(users: UserAccount[]) {
  const [status, setStatus] = useQueryState(
    "statut",
    parseAsStringLiteral(USER_STATUS_FILTERS)
      .withDefault("tous")
      .withOptions({ clearOnDefault: true, history: "push" })
  );

  const counts = useMemo(() => {
    const byStatus = { active: 0, pending: 0 };
    for (const user of users) byStatus[user.status] += 1;
    return { tous: users.length, ...byStatus };
  }, [users]);

  const items: StatusFilterItem<UserStatusFilter>[] = USER_STATUS_FILTERS.map(
    (value) => ({ value, label: FILTER_LABELS[value], count: counts[value] })
  );

  const columnFilters: ColumnFiltersState =
    status === "tous" ? [] : [{ id: "status", value: status }];

  return { status, setStatus, items, columnFilters };
}
