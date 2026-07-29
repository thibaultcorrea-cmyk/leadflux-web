"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/shared/tables/data-table";
import { DataTablePagination } from "@/components/shared/tables/data-table-pagination";
import { DataTableSelectionActions } from "@/components/shared/tables/data-table-selection-actions";
import { DataTableSortMenu } from "@/components/shared/tables/data-table-sort-menu";
import { DataTableStatusFilter } from "@/components/shared/tables/data-table-status-filter";
import { DataTableViewOptions } from "@/components/shared/tables/data-table-view-options";
import { useDataTable } from "@/hooks/useDataTable";
import { useEmailsTableActions } from "../../_hooks/useEmailsTableActions";
import { useEmailStatusFilter } from "../../_hooks/useEmailStatusFilter";
import type { Email } from "../../types/email";
import { getEmailsColumns } from "./emails-columns";

const PAGE_SIZE = 9;

/**
 * Onglet Emails : filtres de statut (portés par l'URL), barre d'actions
 * groupées, tableau et pagination.
 *
 * L'écran est structuré par **statut par prospect**, pas par historique
 * d'envois : ni compteur d'envois, ni taux d'ouverture (CLAUDE.md §3).
 */
export function EmailsTablePanel({ data }: { data: Email[] }) {
  const { rowActions, bulkActions } = useEmailsTableActions();
  const { status, setStatus, items, columnFilters } = useEmailStatusFilter(data);

  const columns = useMemo(() => getEmailsColumns(rowActions), [rowActions]);

  const { table, selectedRows, resetSelection } = useDataTable<Email>({
    data,
    columns,
    getRowId: (email) => email.id,
    enableRowSelection: true,
    enablePagination: true,
    pageSize: PAGE_SIZE,
    columnFilters,
    // Pas de tri initial : les données arrivent déjà par activité décroissante,
    // c'est l'ordre « activité récente » proposé par défaut dans le menu de tri.
  });

  return (
    <div className="flex flex-col gap-5">
      <DataTableStatusFilter
        items={items}
        value={status}
        onValueChange={setStatus}
        label="Filtrer les emails par statut"
      />

      <section
        aria-label="Emails suivis"
        className="flex flex-col gap-3.5 rounded-xl border border-border bg-card p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <DataTableSelectionActions
            selectedRows={selectedRows}
            actions={bulkActions}
            onClearSelection={resetSelection}
          />

          <div className="ml-auto flex items-center gap-2">
            <DataTableSortMenu table={table} defaultLabel="activité récente" />
            <DataTableViewOptions table={table} />
          </div>
        </div>

        <DataTable
          table={table}
          emptyMessage="Aucun email pour ce statut."
        />

        <DataTablePagination table={table} itemLabel="emails" />
      </section>
    </div>
  );
}
