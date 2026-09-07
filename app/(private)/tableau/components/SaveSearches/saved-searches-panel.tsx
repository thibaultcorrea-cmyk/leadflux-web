import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ClearSavedSearchesButton } from "./ClearSavedSearchesButton";
import SavedSearchList from "./SavedSearchList";

export function SavedSearchesPanel() {



  return (
    <Card className="gap-3.5 ring-border [--card-spacing:--spacing(5)]">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <h2 className="text-[15px] font-semibold text-ink-900">
          Recherches enregistrées
        </h2>
        <ClearSavedSearchesButton />
      </CardHeader>
      <CardContent>
        <SavedSearchList />
      </CardContent>
    </Card>
  );
}


