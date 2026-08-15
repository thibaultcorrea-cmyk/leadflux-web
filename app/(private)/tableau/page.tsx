import { NewSearchButton } from "@/components/shared/Buttons/NewSearchButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FunnelPanel } from "./components/funnel-panel";
import { SavedSearchesPanel } from "./components/SaveSearches/saved-searches-panel";
import { RecentActivityPanel } from "./components/table/recent-activity-panel";
import KpiHeaderSection from "./components/KpiHeaderSection/KpiHeaderSection";


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

      <KpiHeaderSection />

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
