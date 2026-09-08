import { EmailProspectsServicesImpl } from "@/features/emails/services"
import { errorApiHandler } from "@/lib/handler"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * Declenche un passage complet du scan de reponses IMAP (cf.
 * features/emails/repositories/scan.ts) : mailbox/batchSize optionnels dans
 * le corps, defauts geres par EmailScanRepositoriesImpl. Le declencheur
 * (cron, appel manuel...) n'est pas encore tranche (CLAUDE.md §8, point 1),
 * cette route ne fait qu'exposer l'operation.
 */
export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json().catch(() => ({}))
        const { mailbox, batchSize } = body as { mailbox?: string; batchSize?: number }

        const result = await EmailProspectsServicesImpl.scanReply(mailbox, batchSize)

        return NextResponse.json(result)
    } catch (error) {
        return errorApiHandler(error)
    }
}
