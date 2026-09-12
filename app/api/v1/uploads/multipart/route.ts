import { NextRequest, NextResponse } from "next/server"
import { UploadsServicesImpl } from "@/features/uploads/services"
import { errorApiHandler } from "@/lib/handler"
import { handleAbort, handleComplete, handleWriteChunk } from "../_lib/handlers"

// L'assemblage des chunks passe par node:fs (features/uploads/repositories/),
// incompatible avec le runtime Edge.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json()
        const result = await UploadsServicesImpl.createSession(body)
        return NextResponse.json(result, { status: 201 })
    } catch (error) {
        return errorApiHandler(error)
    }
}

export const PATCH = handleWriteChunk
export const PUT = handleComplete
export const DELETE = handleAbort
