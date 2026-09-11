"use client";

import type { FilterFn } from "@tanstack/react-table";
import { useState } from "react";

import type { UserAccount } from "../../../../types/user";

/**
 * Cherche à la fois sur le nom et l'email : la colonne "Utilisateur" n'expose
 * que le nom comme valeur de tri/filtre de colonne, l'email n'est affiché que
 * dans `UserCell`.
 */
export const usersGlobalFilterFn: FilterFn<UserAccount> = (row, _columnId, filterValue) => {
  const query = String(filterValue).trim().toLowerCase();
  if (!query) return true;
  const { name, email } = row.original;
  return `${name} ${email}`.toLowerCase().includes(query);
};

export function useUsersSearch() {
  const [search, setSearch] = useState("");
  return { search, setSearch };
}
