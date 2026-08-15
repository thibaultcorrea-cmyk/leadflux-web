import { KpiApiReturn } from "../../types/tableau";
import { kpisIconsMap } from "../../services/utils";
import z from "zod";
import { kpiSchema } from "./kpisSchema";


export const parser = {
    mapIcon: (kpisData: KpiApiReturn[]) => {
        const iconsMap = kpisData.map((kpi) => {


            return {
                ...kpi,
                icon: kpisIconsMap[kpi.id],
            };
        });
        return z.array(kpiSchema).safeParse(iconsMap).data ?? [];
    }

}