import { Readable } from "node:stream"
import { NextRequest, NextResponse } from "next/server"
import { UploadsServicesImpl } from "@/features/uploads/services"
import { errorApiHandler } from "@/lib/handler"
import { SystemServicesImpl } from "@/features/system/services"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Diffuse le blob du logo de l'utilisateur connecte. Pas de parametre : un
 * utilisateur n'a qu'un seul logo actif (reglage "logo" unique par userId,
 * cf. db/schemas/settings.ts), la cle de stockage est donc resolue depuis la
 * session plutot que recue en query string.
 */
export const GET = async (_request: NextRequest) => {
    try {
        const file = await SystemServicesImpl.currentLogo()
        const { stream } = await UploadsServicesImpl.readByPath(file.path)

        return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
            headers: {
                "Content-Type": file.type,
                "Content-Length": String(file.size),
            },
        })
    } catch (error) {
        return errorApiHandler(error)
    }
}

/**
 * Diffuse le blob d'un fichier arbitraire par sa cle de stockage (files.path)
 * ou son id (files.id), transmis dans le corps JSON de la requete. Aucun des
 * deux champs n'est requis individuellement, mais l'un des deux doit etre
 * present (400 sinon) ; key est prioritaire si les deux sont fournis.
 */
export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json().catch(() => null)
        const key = typeof body?.key === "string" ? body.key : undefined
        const id = typeof body?.id === "string" ? body.id : undefined

        if (!key && !id) {
            return NextResponse.json({ message: "Le champ \"key\" ou \"id\" est requis." }, { status: 400 })
        }

        const { file, stream } = key
            ? await UploadsServicesImpl.readByPath(key)
            : await UploadsServicesImpl.read(id!)

        return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
            headers: {
                "Content-Type": file.type,
                "Content-Length": String(file.size),
            },
        })
    } catch (error) {
        return errorApiHandler(error)
    }
}
