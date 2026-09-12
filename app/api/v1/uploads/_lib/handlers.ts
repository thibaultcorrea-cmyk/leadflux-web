import { NextRequest, NextResponse } from "next/server"
import { UploadsServicesImpl } from "@/features/uploads/services"
import { errorApiHandler } from "@/lib/handler"



/**
 * Partages entre /api/v1/uploads/multipart et /api/v1/uploads/logo : les phases
 * chunk/complete/abort sont identiques quel que soit le contexte (le contexte
 * n'intervient qu'a la creation de session, cf. les route.ts appelants).
 */
export const handleWriteChunk = async (request: NextRequest) => {
    try {
        const uploadId = request.nextUrl.searchParams.get("uploadId") ?? ""
        const chunkIndex = Number(request.nextUrl.searchParams.get("chunkIndex"))
        const data = Buffer.from(await request.arrayBuffer())
        const result = await UploadsServicesImpl.writeChunk({ uploadId, chunkIndex, data })
        return NextResponse.json(result)
    } catch (error) {
        return errorApiHandler(error)
    }
}

export const handleComplete = async (request: NextRequest) => {
    try {
        const uploadId = request.nextUrl.searchParams.get("uploadId") ?? ""
        const file = await UploadsServicesImpl.complete({ uploadId })
        return NextResponse.json({ file, url: `/api/v1/uploads/${file.id}/${file.id}.${file.extension}` })
    } catch (error) {
        return errorApiHandler(error)
    }
}

export const handleAbort = async (request: NextRequest) => {
    try {
        const uploadId = request.nextUrl.searchParams.get("uploadId") ?? ""
        await UploadsServicesImpl.abort({ uploadId })
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return errorApiHandler(error)
    }
}
