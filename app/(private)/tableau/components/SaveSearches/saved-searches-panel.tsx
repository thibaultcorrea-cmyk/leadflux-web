import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SavedSearchList from "./SavedSearchList";

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
        <SavedSearchList />
      </CardContent>
    </Card>
  );
}


