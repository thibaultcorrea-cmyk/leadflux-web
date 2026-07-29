"use client";

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Table,
  type VisibilityState,
} from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";

export type UseDataTableOptions<TData, TValue = unknown> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  /** Identifiant stable d'une ligne : indispensable pour que la sélection survive au tri et à la pagination. */
  getRowId?: (row: TData, index: number) => string;
  enableRowSelection?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  initialSorting?: SortingState;
  initialColumnVisibility?: VisibilityState;
};

export type UseDataTableResult<TData> = {
  table: Table<TData>;
  /** Lignes cochées, dans l'ordre du modèle (tri et pagination compris). */
  selectedRows: TData[];
  selectedCount: number;
  resetSelection: () => void;
  /** Nombre de lignes après filtrage, toutes pages confondues. */
  totalCount: number;
};

/**
 * Point d'entrée unique pour construire un tableau de l'application.
 *
 * Il assemble TanStack Table (tri, sélection multiple, pagination, visibilité
 * des colonnes) et laisse le rendu à `DataTable`. Une page ne fournit que ses
 * colonnes et ses données : elle n'écrit ni `useReactTable`, ni state de tri,
 * ni logique de pagination.
 */
export function useDataTable<TData, TValue = unknown>({
  data,
  columns,
  getRowId,
  enableRowSelection = false,
  enablePagination = false,
  pageSize = 10,
  initialSorting = [],
  initialColumnVisibility = {},
}: UseDataTableOptions<TData, TValue>): UseDataTableResult<TData> {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      ...(enablePagination ? { pagination } : {}),
    },
    enableRowSelection,
    // Le retour automatique en page 1 de TanStack déclenche un `setState`
    // pendant le premier rendu (avant montage) : on le désactive et on gère ce
    // retour nous-mêmes dans l'effet ci-dessous, quand les données changent.
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(enablePagination
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),
  });

  const previousData = useRef(data);
  useEffect(() => {
    if (previousData.current === data) return;
    previousData.current = data;
    // Nouveau jeu de données (nouveau sourcing, filtre appliqué) : rester en
    // page 3 afficherait une page vide.
    table.setPageIndex(0);
  }, [data, table]);

  // Recalculé à chaque rendu, comme le reste des modèles TanStack Table :
  // mémoïser ici donnerait une sélection périmée après un tri ou un changement de page.
  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  const resetSelection = useCallback(() => table.resetRowSelection(), [table]);

  return {
    table,
    selectedRows,
    selectedCount: selectedRows.length,
    resetSelection,
    totalCount: table.getFilteredRowModel().rows.length,
  };
}
