import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FunnelPanel } from "./components/funnel-panel";
import { KpiCard } from "./components/kpi-card";
import { SavedSearchesPanel } from "./components/saved-searches-panel";
import { RecentActivityPanel } from "./components/table/recent-activity-panel";
import { kpis } from "./mocks/kpis";
import { NewSearchButton } from "./components/NewSearchButton";

export default function TableauPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Seul point d'entrée de la nav quand la sidebar est repliée ou en mobile. */}
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="font-display text-[42px] leading-none tracking-[0.02em] text-primary-700">
              Tableau de bord
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Vue d&apos;ensemble de votre prospection
            </p>
          </div>
        </div>

        <NewSearchButton />
      </header>

      <section aria-label="Indicateurs clés">
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <li key={kpi.id}>
              <KpiCard kpi={kpi} />
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-6">
          <RecentActivityPanel />
          <FunnelPanel />
        </div>
        <SavedSearchesPanel />
      </div>
    </div>
  );
}
