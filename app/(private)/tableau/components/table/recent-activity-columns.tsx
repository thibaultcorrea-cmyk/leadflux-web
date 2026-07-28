"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge } from "../status-badge";
import type { RecentActivityRow } from "../../types/tableau";

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
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "activityLabel",
    header: "Date",
    size: 90,
    cell: ({ row }) => (
      <span className="text-[13px] text-ink-500">
        {row.original.activityLabel}
      </span>
    ),
  },
];
