import { NextRequest, NextResponse } from "next/server"
import { UploadsServicesImpl } from "@/features/uploads/services"
import { SettingsServicesImpl } from "@/features/settings/services"
import { UserServices } from "@/features/users/services"
import { errorApiHandler } from "@/lib/handler"
import { handleAbort, handleWriteChunk } from "../_lib/handlers"

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

/**
 * PUT dedie plutot que le handleComplete partage avec /multipart : c'est ici,
 * une fois le fichier assemble, qu'on met a jour le reglage "logo" de
 * l'utilisateur avec la cle de stockage (files.path) du fichier fraichement
 * cree. Ce PUT ne doit jamais etre reutilise par un autre contexte d'upload.
 */
export const PUT = async (request: NextRequest) => {
    try {
        const uploadId = request.nextUrl.searchParams.get("uploadId") ?? ""
        const file = await UploadsServicesImpl.complete({ uploadId })

        const currentUser = await UserServices.getCurrentUser()
        await SettingsServicesImpl.setLogo(currentUser.id, { key: file.path })

        return NextResponse.json({ file, url: `/api/v1/uploads/${file.id}/${file.id}.${file.extension}` })
    } catch (error) {
        return errorApiHandler(error)
    }
}

export const DELETE = handleAbort
