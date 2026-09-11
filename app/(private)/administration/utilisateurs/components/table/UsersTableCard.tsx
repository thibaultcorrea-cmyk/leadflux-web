"use client";

import { Info } from "lucide-react";
import { useMemo } from "react";

import { DataTable } from "@/components/shared/tables/data-table";
import { DataTablePagination } from "@/components/shared/tables/data-table-pagination";
import { DataTableSelectionActions } from "@/components/shared/tables/data-table-selection-actions";
import { DataTableSortMenu } from "@/components/shared/tables/data-table-sort-menu";
import { DataTableStatusFilter } from "@/components/shared/tables/data-table-status-filter";
import { DataTableViewOptions } from "@/components/shared/tables/data-table-view-options";
import { useDataTable } from "@/hooks/useDataTable";
import { useUserStatusFilter } from "../../hooks/useUserStatusFilter";
import { useUsersMutation } from "../../hooks/useUsersMutation";
import { useUsersSearch, usersGlobalFilterFn } from "../../hooks/useUsersSearch";
import { useUsersTableActions } from "../../hooks/useUsersTableActions";
import { getUsersColumns } from "./users-columns";
import { UsersSearchInput } from "./UsersSearchInput";

const PAGE_SIZE = 10;

/**
 * Corps de la page Utilisateurs (maquette "Users Table") : recherche par
 * nom/email, filtre de statut, sélection multiple, tri, pagination et actions
 * de ligne/groupées — même logique que la table Emails (`EmailsTablePanel`).
 * Occupe toute la hauteur disponible de la page (cf. `UtilisateursPage`) :
 * seule la liste des lignes défile, l'en-tête d'actions et la note de pied
 * de tableau restent visibles.
 */
export function UsersTableCard() {
  const { users, removeUsers } = useUsersMutation();
  const { rowActions, bulkActions } = useUsersTableActions(users, removeUsers);
  const { status, setStatus, items, columnFilters } = useUserStatusFilter(users);
  const { search, setSearch } = useUsersSearch();

  const columns = useMemo(() => getUsersColumns(rowActions), [rowActions]);

  const { table, selectedRows, resetSelection } = useDataTable({
    data: users,
    columns,
    getRowId: (user) => user.id,
    // On ne peut pas se sélectionner soi-même pour une suppression groupée.
    enableRowSelection: (row) => !row.original.isCurrentUser,
    enablePagination: true,
    pageSize: PAGE_SIZE,
    columnFilters,
    globalFilter: search,
    globalFilterFn: usersGlobalFilterFn,
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <DataTableStatusFilter
        items={items}
        value={status}
        onValueChange={setStatus}
        label="Filtrer les utilisateurs par statut"
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-3.5">
          <UsersSearchInput value={search} onValueChange={setSearch} />
          <DataTableSelectionActions
            selectedRows={selectedRows}
            actions={bulkActions}
            onClearSelection={resetSelection}
          />
          <div className="ml-auto flex items-center gap-2">
            <DataTableSortMenu table={table} defaultLabel="nom" />
            <DataTableViewOptions table={table} />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          <DataTable
            table={table}
            emptyMessage={
              search
                ? "Aucun utilisateur ne correspond à cette recherche."
                : "Aucun utilisateur pour ce statut."
            }
          />
        </div>

        <div className="flex items-start gap-2 border-t border-border px-5 py-3">
          <Info className="mt-0.5 size-3.5 shrink-0 text-ink-500" aria-hidden />
          <p className="text-xs leading-[1.4] text-ink-500">
            Modifier le profil, changer le mot de passe, renvoyer une invitation ou supprimer un
            compte se font depuis le menu «&nbsp;…&nbsp;» de chaque ligne. La suppression demande
            une confirmation, et le dernier administrateur ne peut pas être retiré. Une
            invitation expire après 7 jours.
          </p>
        </div>

        <DataTablePagination table={table} itemLabel="utilisateurs" className="px-5 pb-4" />
      </div>
    </div>
  );
}
