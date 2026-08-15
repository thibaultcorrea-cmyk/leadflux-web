import { EmailSqlInfer, EmailSqlInsert } from "@/db/schemas"
import { Email } from "../entities/type"




export interface IEmailReadRepository {
    get: (id: string) => Promise<EmailSqlInfer>
    /**
     * Retourne la forme d'affichage (cf. mocks/emails.ts), pas la ligne SQL
     * brute : tant que la jointure emails + email_versions n'est pas ecrite,
     * find sert les memes donnees que le mock du front pour que le resolver
     * GraphQL emailsProspects ait une forme stable.
     */
    find: (query: any) => Promise<Email[]>
    count?: (query: any) => Promise<number>

}

export interface IEmailWriteRepository {
    create: (email: EmailSqlInsert) => Promise<EmailSqlInfer>
    update: (email: Partial<EmailSqlInfer>) => Promise<EmailSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    truncate: () => Promise<void>

}
