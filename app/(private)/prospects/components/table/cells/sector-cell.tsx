import { Badge } from "@/components/ui/badge";

/** Colonne Secteur : puce discrète en violet cramoisi clair, jamais en doré (réservé aux actions). */
export function SectorCell({ sector }: { sector: string }) {
  return (
    <Badge className="h-auto bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
      {sector}
    </Badge>
  );
}
