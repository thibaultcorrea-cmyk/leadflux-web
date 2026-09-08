import { EmailProspectsServicesImpl } from "@/features/emails/services"
import { errorApiHandler } from "@/lib/handler"
import { after, NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * Declenche un passage complet du scan de reponses IMAP (cf.
 * features/emails/repositories/scan.ts) : mailbox/batchSize optionnels dans
 * le corps, defauts geres par EmailScanRepositoriesImpl. Le declencheur
 * (cron, appel manuel...) n'est pas encore tranche (CLAUDE.md §8, point 1),
 * cette route ne fait qu'exposer l'operation.
 *
 * Le scan peut boucler longtemps sur un gros retard (plusieurs batchs IMAP +
 * DB) : on repond tout de suite (202, fire-and-forget) via after() plutot que
 * d'attendre la fin, pour ne pas risquer un timeout si la route atterrit un
 * jour derriere une plateforme serverless (hebergement pas encore tranche,
 * CLAUDE.md §8.3). Consequence : l'appelant n'a plus le resultat dans la
 * reponse, seulement dans les logs — a relire checkpointer.json ou logger le
 * resultat si un statut post-hoc devient necessaire.
 */
export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json().catch(() => ({}))
        const { mailbox, batchSize } = body as { mailbox?: string; batchSize?: number }

        after(async () => {
            try {
                const result = await EmailProspectsServicesImpl.scanReply(mailbox, batchSize)
                console.log("scanReply termine", result)
            } catch (error) {
                console.error("scanReply a echoue", error)
            }
        })

        return NextResponse.json({ message: "Scan des reponses demarre" }, { status: 202 })
    } catch (error) {
        return errorApiHandler(error)
    }
}
