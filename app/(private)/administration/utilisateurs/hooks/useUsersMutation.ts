"use client";

import { useState } from "react";

import { waitDelay } from "@/lib/utils";
import { usersMock } from "../../../../services/users-mock";
import type { UserAccount } from "../../../../types/user";

/**
 * État local simulé de la liste des utilisateurs : aucune API n'est branchée
 * (le modèle Drizzle réel reste à concevoir, CLAUDE.md §8.8), donc la
 * suppression met juste à jour ce state après un délai simulé.
 */
export function useUsersMutation() {
  const [users, setUsers] = useState<UserAccount[]>(() => usersMock.getUsers());

  const removeUsers = async (ids: string[]) => {
    await waitDelay(600);
    setUsers((current) => current.filter((user) => !ids.includes(user.id)));
  };

  return { users, removeUsers };
}
