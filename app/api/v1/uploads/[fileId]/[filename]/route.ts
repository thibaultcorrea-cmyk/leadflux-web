import { Readable } from "node:stream"
import { NextRequest, NextResponse } from "next/server"
import { UploadsServicesImpl } from "@/features/uploads/services"
import { errorApiHandler } from "@/lib/handler"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const GET = async (_request: NextRequest, { params }: { params: Promise<{ fileId: string; filename: string }> }) => {
    try {
        const { fileId } = await params
        // "filename" est cosmetique (nom d'affichage/telechargement) : jamais
        // utilise pour resoudre le chemin disque reel, qui vient uniquement de
        // la ligne `files` via UploadsServicesImpl.read (evite tout path
        // traversal a partir de l'URL).
        const { file, stream } = await UploadsServicesImpl.read(fileId)

        return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
            headers: {
                "Content-Type": file.type,
                "Content-Length": String(file.size),
                "Content-Disposition": `inline; filename="${encodeURIComponent(file.originalName)}"`,
                "Cache-Control": "private, max-age=0, must-revalidate",
            },
        })
    } catch (error) {
        return errorApiHandler(error)
    }
}
