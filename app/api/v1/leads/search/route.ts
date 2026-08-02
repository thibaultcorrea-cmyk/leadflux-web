import { errorApiHandler } from "@/lib/handler"
import { NextResponse } from "next/server"
import leadFinder from "../mocks/leads-finder-1785665650250.json"

export const POST = async () => {

    try {

        return NextResponse.json(leadFinder)

    } catch (error) {
        return errorApiHandler(error)
    }



}