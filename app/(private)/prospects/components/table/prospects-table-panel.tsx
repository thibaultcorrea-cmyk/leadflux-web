"use client";

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
import { ProspectsTableContent } from "./prospects-table-content";
import { parseForCriteriaBar, prospectsRowDisplayCriteria } from "../../services/row-actions";

const PAGE_SIZE = 8;

/**
 * Panneau de résultats du sourcing : compteur, actions groupées, tri, choix des
 * colonnes, tableau et pagination.
 *
 * Toute la mécanique du tableau vient de `useDataTable` et des briques de
 * `components/shared/tables` ; cette page ne fournit que ses colonnes, ses
 * données et ses actions.
 */
export function ProspectsTablePanel() {

  const { prospects, criteria, isLoading, error } = useFetchSearchProspectResults();


  const searchCriteria = parseForCriteriaBar(criteria)








  return (

    <>
      <CriteriaBar criteria={searchCriteria} />
      <ProspectsTableContent prospects={prospects} />

    </>

  );
}
