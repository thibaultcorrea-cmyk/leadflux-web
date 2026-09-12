import { Readable } from "node:stream"
import { NextRequest, NextResponse } from "next/server"
import { LOGO_SETTING_KEY } from "@/features/settings/dto/schema"
import { settingsValidator } from "@/features/settings/dto/validator"
import { SettingsServicesImpl } from "@/features/settings/services"
import { UploadsServicesImpl } from "@/features/uploads/services"
import { errorApiHandler } from "@/lib/handler"

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
        // SettingsServicesImpl.get resout l'utilisateur courant depuis la
        // session : leve si personne n'est connecte.
        const setting = await SettingsServicesImpl.get(LOGO_SETTING_KEY)

        const validated = settingsValidator.validateLogoValue(setting?.value)
        if (!validated.success) {
            return NextResponse.json({ message: "Aucun logo n'est configuré." }, { status: 404 })
        }

        const { file, stream } = await UploadsServicesImpl.readByPath(validated.data.key)

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
