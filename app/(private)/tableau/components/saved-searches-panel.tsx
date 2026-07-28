import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { savedSearches } from "../mocks/saved-searches";

export function SavedSearchesPanel() {
  return (
    <Card className="gap-3.5 ring-border [--card-spacing:--spacing(5)]">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <h2 className="text-[15px] font-semibold text-ink-900">
          Recherches enregistrées
        </h2>
        <Link
          href="/prospects"
          className="rounded-sm text-[13px] font-medium text-accent-700 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          Gérer
        </Link>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2.5">
          {savedSearches.map((search) => (
            <li key={search.id}>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-md border border-border bg-background-100 px-3 py-2.5 text-left transition-colors outline-none hover:bg-background-200 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium text-ink-900">
                    {search.name}
                  </span>
                  <span className="block truncate text-[11px] text-ink-500">
                    {search.criteria}
                  </span>
                </span>
                <span className="text-[13px] font-semibold text-ink-700 tabular-nums">
                  {search.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
