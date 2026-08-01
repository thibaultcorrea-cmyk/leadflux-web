"use client"

import { Suspense } from "react";
import useGetKpis from "../../_hooks/useGetKpis";
import { KpiCard } from "../kpi-card";
import { KpiSectionLoading } from "./loading";




const KpiHeaderSection = () => {
    const { kpis, isError, isLoading, refetch } = useGetKpis();
    if (isLoading) return <KpiSectionLoading />

    return (
        <Suspense fallback={<KpiSectionLoading />}>
            <section aria-label="Indicateurs clés">
                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {kpis.map((kpi) => (
                        <li key={kpi.id}>
                            <KpiCard kpi={kpi} />
                        </li>
                    ))}
                </ul>
            </section>
        </Suspense>
    );
}

export default KpiHeaderSection;
