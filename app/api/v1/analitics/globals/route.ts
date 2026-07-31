import { errorApiHandler } from "@/lib/handler";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
    try {
        return NextResponse.json({ data: "Assadi" }, { status: 200 });
    } catch (error) {
        return errorApiHandler(error);
    }
};