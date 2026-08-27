"use client"

import { useQuery } from "@tanstack/react-query";
import { funnelSteps } from "../mocks/funnel";
import { QueryKey } from "./queries";
import { retrieveFunnelStep } from "../services/api-services";
import { useMemo } from "react";
import { DEFAULT_FUNNEL_STEP } from "../services/utils";
import { FunnelStep, KpiApiReturn } from "../types/tableau";



export function useFunnelKpi() {

    const { data, isLoading, error } = useQuery({
        queryKey: [QueryKey.GET_FUNNEL_STEP],
        queryFn: retrieveFunnelStep,
    })

    const funnelSteps = useMemo(() => {
        if (!data) return DEFAULT_FUNNEL_STEP
        return kpiItemToFunnelFactory(data?.kpis)
    }, [data])


    // Le premier palier sert de référence : chaque étape se lit en proportion
    // des prospects sourcés, pas de l'étape précédente.
    const reference = funnelSteps.find((step) => step.id === "totalProspects")?.value ?? 0;

    return { reference, funnelSteps, isLoading, error }
}


const kpiItemToFunnelFactory = (kpis: any[]): FunnelStep[] => {
    const kpisFiltered = kpis.filter((kpi) => {
        return kpi.id !== "repliedRate"
    }).map((kpi: KpiApiReturn) => {
        return {
            id: kpi.id,
            label: kpi.label,
            value: kpi.value,
            tone: mapedTone(kpi.id)
        }
    }) satisfies FunnelStep[]

    return kpisFiltered
}



const FUNNEL_TONE_MAP = {
    "repliedRate": "success",
    "drafted": "neutral",
    "sent": "accent",
    "replied": "success",
    "totalProspects": "neutral"
} satisfies Record<string, FunnelStep["tone"]>

const mapedTone = (kpi: KpiApiReturn["id"]): FunnelStep["tone"] => {
    return FUNNEL_TONE_MAP[kpi] ?? "neutral"
}