import { SearchProspectsServicesImpl } from "@/features/search/services"
import { errorApiHandler } from "@/lib/handler"
import { NextResponse } from "next/server"

export const POST = async () => {

    try {

        const result = await SearchProspectsServicesImpl.collections()

        return NextResponse.json(result)

    } catch (error) {
        return errorApiHandler(error)
    }



}