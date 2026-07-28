import Link from "next/link";

import { DataTable } from "@/components/shared/tables/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { recentActivity } from "../../mocks/recent-activity";
import { recentActivityColumns } from "./recent-activity-columns";

export function RecentActivityPanel() {
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
          columns={recentActivityColumns}
          data={recentActivity}
          emptyMessage="Aucune activité pour le moment."
        />
      </CardContent>
    </Card>
  );
}
