"use client"
import { useMemo } from "react";

import { DataTable } from "@/components/shared/tables/data-table";
import { DataTablePagination } from "@/components/shared/tables/data-table-pagination";
import { DataTableSelectionActions } from "@/components/shared/tables/data-table-selection-actions";
import { DataTableSortMenu } from "@/components/shared/tables/data-table-sort-menu";
import { DataTableViewOptions } from "@/components/shared/tables/data-table-view-options";
import { useDataTable } from "@/hooks/useDataTable";
import { useProspectsTableActions } from "../../_hooks/useProspectsTableActions";
import type { Prospect } from "../../types/prospect";
import { getProspectsColumns } from "./prospects-columns";
import { useFetchSearchProspectResults } from "../../_hooks/useFetchSearchProspectResults";
import { TruncateProspectButton } from "./truncate-prospect-button";
import { CriteriaBar } from "../criteria-bar";

const PAGE_SIZE = 8;


type TProspectsTableContent = {
    prospects: Prospect[];

}
export const ProspectsTableContent = ({ prospects }: TProspectsTableContent) => {

    const { rowActions, bulkActions } = useProspectsTableActions();

    const columns = useMemo(() => getProspectsColumns(rowActions), [rowActions]);

    const { table, selectedRows, resetSelection, totalCount } =
        useDataTable<Prospect>({
            data: prospects,
            columns,
            getRowId: (prospect) => prospect.id,
            enableRowSelection: true,
            enablePagination: true,
            pageSize: PAGE_SIZE,
        });
    return (
        <section
            aria-label="Résultats du sourcing"
            className="flex flex-col gap-3.5 rounded-xl border border-border bg-card p-5 relative"
        >
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="flex items-baseline gap-2.5">
                    <span className="font-display text-[30px] leading-none tracking-[0.02em] text-primary-700">
                        {totalCount}
                    </span>
                    <span className="text-[15px] font-medium text-ink-700">
                        entreprise{totalCount > 1 ? "s" : ""} trouvée
                        {totalCount > 1 ? "s" : ""}
                    </span>
                </h2>

                <DataTableSelectionActions
                    selectedRows={selectedRows}
                    actions={bulkActions}
                    onClearSelection={resetSelection}
                />

                <div className="flex items-center gap-2">
                    <DataTableSortMenu table={table} defaultLabel="pertinence" />
                    <DataTableViewOptions table={table} />
                    <TruncateProspectButton />

                </div>
            </div>

            <DataTable
                table={table}
                emptyMessage="Aucune entreprise ne correspond à ces critères."
            />

            <DataTablePagination table={table} itemLabel="résultats" />
        </section>
    );
}