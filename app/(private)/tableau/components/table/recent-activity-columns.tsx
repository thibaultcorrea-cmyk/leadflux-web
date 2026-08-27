"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { EmailStatusBadge } from "@/components/shared/badges/email-status-badge";
import type { RecentActivityRow } from "../../types/tableau";
import { RecentActivityTimestampCell } from "../recent-activity-timestamp-cell";

export const recentActivityColumns: ColumnDef<RecentActivityRow>[] = [
  {
    accessorKey: "prospect",
    header: "Prospect",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-ink-900">
        {row.original.prospect}
      </span>
    ),
  },
  {
    accessorKey: "company",
    header: "Entreprise",
    size: 200,
    cell: ({ row }) => (
      <span className="text-sm text-ink-700">{row.original.company}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    size: 150,
    cell: ({ row }) => <EmailStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "timestamp",
    header: "Date",
    size: 90,
    cell: ({ row }) => <RecentActivityTimestampCell item={row.original} />

    ,
  },
];
