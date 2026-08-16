import { EmailSqlInfer, EmailStatusValue } from "@/db/schemas"
import { EmailProspectsServices } from "./entities/services"
import { CreateEmailDto, UpdateEmailStatusDto } from "./dto/schema"
import { emailValidator } from "./dto/validator"
import { EmailWriteRepositoriesImpl } from "./repositories/write"
import { EmailReadRepositoriesImpl } from "./repositories/read"
import { UserServices } from "../users/services"
import { EmailVersionWriteRepositoriesImpl } from "../emailVersions/repositories/write"
import { AgentEmailService } from "../agent/email/service"
import { emailFromRow } from "./factory/email-factory"



export const EmailProspectsServicesImpl: EmailProspectsServices = {
    create: async (input: CreateEmailDto) => {
        const validated = emailValidator.validate(input)
        if (!validated.success) {
            throw validated.error
        }
        return await EmailWriteRepositoriesImpl.create(validated.data)

    },

    generate: async (inputs: CreateEmailDto) => {
        const currentUser = await UserServices.getCurrentUser()

        const validated = emailValidator.validate(inputs)
        if (!validated.success) {
            throw validated.error
        }
        const status: EmailStatusValue = "draft"
        // Call Agent Service to generate email content from knowlege base
        const agentResponse = await AgentEmailService.generate(inputs)

        //Create new version with status draft
        const email = await EmailWriteRepositoriesImpl.create({
            ...inputs,
            validatedBy: currentUser.id,
            status,
        })
        const version = await EmailVersionWriteRepositoriesImpl.create({
            emailId: email.id,
            body: agentResponse.body,
            subject: agentResponse.subject,
            generatedAt: new Date(),
            knowledgeVersion: agentResponse.knowledgeVersion,
        })

        const emailRow = emailFromRow(email, [version])
        return emailRow


    },
    generateMany: async (inputs: CreateEmailDto[]) => {

        const succeded = []
        const failed = []

        try {
            for (const input of inputs) {
                try {
                    const email = await EmailProspectsServicesImpl.generate(input)
                    succeded.push(email)
                } catch (error) {
                    failed.push(error)

                }
            }
            return { success: true, send: succeded.length, failed: failed.length }
        } catch (error) {
            console.log(error);

            return { success: false, send: 0, failed: inputs.length }
        }


    },

    send: async (id: string) => {
        throw new Error("Method not implemented.")
    },

    sendMany: async (ids: string[]) => {
        throw new Error("Method not implemented.")
    },

    regenerate: async (id: string) => {
        throw new Error("Method not implemented.")
    },
    regenerateMany: async (ids: string[]) => {
        throw new Error("Method not implemented.")
    },

    collections: async (query: any) => {
        return EmailReadRepositoriesImpl.find(query)
    },
    update: async (email) => {
        throw new Error("Method not implemented.")
    },

    /**
     * Horodate l'evenement du statut cible (sent_at + validated_by, ou
     * replied_at) et rafraichit last_activity_at. La legalite de la transition
     * (ex. peut-on repasser de sent a draft pour une relance ?) n'est pas
     * tranchee (CLAUDE.md §3) : cette methode horodate, elle n'impose pas de
     * graphe d'etats.
     */
    updateStatus: async (input: UpdateEmailStatusDto) => {
        const validated = emailValidator.validateStatus(input)
        if (!validated.success) {
            throw validated.error
        }

        const { data } = validated
        const now = new Date()
        const patch: Partial<EmailSqlInfer> = {
            id: data.id,
            status: data.status,
            lastActivityAt: now,
        }

        if (data.status === "sent") {
            const currentUser = await UserServices.getCurrentUser()
            patch.sentAt = now
            patch.validatedBy = currentUser.id
            patch.threadId = data.threadId
        }

        if (data.status === "replied") {
            patch.repliedAt = now
        }

        return EmailWriteRepositoriesImpl.update(patch)
    },

    delete: async (id: string) => {
        await EmailWriteRepositoriesImpl.delete(id)
    },
    deleteMany: async (ids: string[]) => {
        await EmailWriteRepositoriesImpl.deleteMany(ids)
    },
    clear: async () => {
        await EmailWriteRepositoriesImpl.truncate()
    },
}

