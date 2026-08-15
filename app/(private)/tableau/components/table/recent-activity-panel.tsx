"use client";

import Link from "next/link";

import { DataTable } from "@/components/shared/tables/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDataTable } from "@/hooks/useDataTable";
import type { RecentActivityRow } from "../../types/tableau";
import { recentActivityColumns } from "./recent-activity-columns";
import { RecentActivityLoading } from "./recent-activity-loading";
import useFetchRecentlyActivity from "../../_hooks/useFetchRecentlyActivity";
import { recentActivity } from "../../mocks/recent-activity";


export function RecentActivityPanel() {
  const { isloading, isError, recentlyActivity } = useFetchRecentlyActivity();
  const { table } = useDataTable<RecentActivityRow>({
    data: isError || isloading ? [] : recentlyActivity,
    columns: recentActivityColumns,
    getRowId: (row) => row.id,
  });


  if (isloading) return <RecentActivityLoading />
  if (isError) return <p>Error</p>

  return (
    <Card className="gap-3.5 ring-border [--card-spacing:--spacing(5)]">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <h2 className="text-[15px] font-semibold text-ink-900">
          Activité récente
        </h2>
        <Link
          href="/emails"
          className="rounded-sm text-[13px] font-medium text-accent-700 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          Voir tous les emails
        </Link>
      </CardHeader>
      <CardContent>
        <DataTable
          table={table}
          emptyMessage="Aucune activité pour le moment."
        />
      </CardContent>
    </Card>
  );
}
