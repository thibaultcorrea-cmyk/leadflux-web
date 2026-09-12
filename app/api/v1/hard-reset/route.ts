import { SystemServicesImpl } from "@/features/system/services"
import { errorApiHandler } from "@/lib/handler"
import { NextResponse } from "next/server"

export const POST = async () => {

    try {

        await SystemServicesImpl.clear()

        return NextResponse.json({ success: true })

    } catch (error) {
        return errorApiHandler(error)
    }

}
