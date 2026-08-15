import { funnelSteps } from "@/app/(private)/tableau/mocks/funnel";
import { errorApiHandler } from "@/lib/handler";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
    try {
        return NextResponse.json(funnelSteps);
    } catch (error) {
        return errorApiHandler(error);
    }
};