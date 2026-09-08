import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { ImapMessageEnvelope } from "../../imap/entities/imapflow"
import { IMAPServiceImpl } from "../../imap/services"
import { EmailWriteRepositoriesImpl } from "./write"

/**
 * Un seul fichier pour toutes les boites suivies (cle = nom de la mailbox),
 * pour ne pas multiplier les fichiers si une deuxieme boite est un jour
 * scannee. En v1 une seule entree ("INBOX") est utilisee.
 */
const CHECKPOINT_FILE = path.join(process.cwd(), "checkpointer.json")

type ReplyScanCheckpoint = {
    lastUid?: number
}

type ReplyScanCheckpointFile = Record<string, ReplyScanCheckpoint>

async function readCheckpointFile(): Promise<ReplyScanCheckpointFile> {
    try {
        const raw = await readFile(CHECKPOINT_FILE, "utf-8")
        return JSON.parse(raw) as ReplyScanCheckpointFile
    } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") {
            return {}
        }
        throw error
    }
}

async function writeCheckpoint(mailbox: string, checkpoint: ReplyScanCheckpoint): Promise<void> {
    const all = await readCheckpointFile()
    all[mailbox] = checkpoint
    await writeFile(CHECKPOINT_FILE, JSON.stringify(all, null, 2), "utf-8")
}

/**
 * In-Reply-To porte un seul Message-ID, References peut en porter plusieurs
 * (deplies sur un seul header par imap-server.ts) : chaque token est un
 * thread_id candidat, a matcher tel quel contre emails.thread_id.
 */
function extractCandidateThreadIds(message: ImapMessageEnvelope): string[] {
    const tokens = [message.inReplyTo, ...(message.references?.split(/\s+/) ?? [])].filter(
        (token): token is string => Boolean(token),
    )
    return Array.from(new Set(tokens))
}

export type ScanReplyResult = {
    scanned: number
    matched: number
    lastUid: number | null
}

export const EmailScanRepositoriesImpl = {
    /**
     * Detection en masse des reponses aux emails "sent" : une seule
     * connexion IMAP (IMAPServiceImpl.fetchMailboxWithRange), matching local
     * des threadId candidats, checkpoint (dernier uid traite) persiste dans
     * checkpointer.json pour ne jamais rescanner un message deja vu. Boucle
     * tant qu'un batch plein revient ; le declencheur (cron, appel manuel...)
     * n'est pas encore tranche (CLAUDE.md §8, point 1), cette methode se
     * contente de faire tourner un passage complet quand on l'appelle.
     */
    scanReply: async (mailbox = "INBOX", batchSize = 200): Promise<ScanReplyResult> => {
        const checkpoints = await readCheckpointFile()
        const checkpoint: ReplyScanCheckpoint = checkpoints[mailbox] ?? {}

        let scanned = 0
        let matched = 0

        while (true) {
            const batch = await IMAPServiceImpl.fetchMailboxWithRange({
                mailbox,
                checkpoint: { sinceUid: checkpoint.lastUid },
                batchSize,
            })

            if (batch.length === 0) {
                break
            }

            const tokenToMessage = new Map<string, ImapMessageEnvelope>()
            for (const message of batch) {
                for (const token of extractCandidateThreadIds(message)) {
                    if (!tokenToMessage.has(token)) {
                        tokenToMessage.set(token, message)
                    }
                }
            }

            if (tokenToMessage.size > 0) {
                const replies = Array.from(tokenToMessage.entries()).map(([threadId, message]) => ({
                    threadId,
                    // Date reelle de la reponse recuperee par le scan IMAP, pas la date du passage du job.
                    repliedAt: message.date ?? new Date(),
                }))
                const updated = await EmailWriteRepositoriesImpl.markRepliedByThreadIds(replies)
                matched += updated.length
            }

            scanned += batch.length
            checkpoint.lastUid = Math.max(...batch.map((message) => message.uid))
            await writeCheckpoint(mailbox, checkpoint)

            if (batch.length < batchSize) {
                break
            }
        }

        return { scanned, matched, lastUid: checkpoint.lastUid ?? null }
    },
}
