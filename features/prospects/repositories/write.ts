import { db } from "@/db"
import { prospects, ProspectSqlInfer, ProspectSqlInsert } from "@/db/schemas"
import { eq, inArray } from "drizzle-orm"
import { IProspectWriteRepository } from "../entities/repository"



/**
 * create fait un onConflictDoUpdate sur (person_id, company_id) : c'est la cle
 * d'idempotence du pipeline de sourcing documentee dans db/schemas/prospects.ts,
 * un re-sourcing rafraichit raw_payload et last_sourced_at sans creer de doublon.
 */
export const ProspectWriteRepositoriesImpl: IProspectWriteRepository = {
    create: async (data: ProspectSqlInsert) => {
        const [result] = await db.insert(prospects).values(data)
            .onConflictDoUpdate({
                target: [prospects.personId, prospects.companyId],
                set: {
                    rawPayload: data.rawPayload,
                    lastSourcedAt: new Date(),
                },
            })
            .returning()

        return result
    },

    update: async (data: Partial<ProspectSqlInfer>): Promise<ProspectSqlInfer> => {
        const [result] = await db.update(prospects).set({
            ...data,

        }).where(eq(prospects.id, data.id!)).returning()

        return result
    },

    delete: async (id: string) => {
        await db.delete(prospects).where(eq(prospects.id, id))
    },
    deleteMany: async (ids: string[]) => {
        await db.delete(prospects).where(inArray(prospects.id, ids))
    },

    truncate: async () => {
        await db.delete(prospects)
    },
}
