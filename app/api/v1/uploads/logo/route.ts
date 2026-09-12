import { NextRequest, NextResponse } from "next/server"
import { UploadsServicesImpl } from "@/features/uploads/services"
import { errorApiHandler } from "@/lib/handler"
import { handleAbort, handleComplete, handleWriteChunk } from "../_lib/handlers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json()
        // Le contexte est force cote serveur (defense en profondeur) : cette
        // route reste "logo" quoi que le client envoie, pour que les regles de
        // validation logo (features/uploads/services.ts) ne puissent pas etre
        // contournees en passant un autre contexte.
        const result = await UploadsServicesImpl.createSession({ ...body, context: "logo" })
        return NextResponse.json(result, { status: 201 })
    } catch (error) {
        return errorApiHandler(error)
    }
}

export const PATCH = handleWriteChunk
export const PUT = handleComplete
export const DELETE = handleAbort
