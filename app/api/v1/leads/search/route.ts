import { errorApiHandler } from "@/lib/handler"
import { NextResponse } from "next/server"
import { ProspectServicesImpl } from "@/features/prospects/services"

export const POST = async () => {

    try {

        const result = await ProspectServicesImpl.collections()

        return NextResponse.json(result)

    } catch (error) {
        return errorApiHandler(error)
    }



}