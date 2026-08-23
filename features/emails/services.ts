import { EmailSqlInfer, EmailStatusValue, EmailVersionSqlInfer } from "@/db/schemas"
import { EmailProspectsServices } from "./entities/services"
import { CreateEmailByProspectIdDto, CreateEmailDto, UpdateEmailContentDto, UpdateEmailStatusDto } from "./dto/schema"
import { emailValidator } from "./dto/validator"
import { EmailWriteRepositoriesImpl } from "./repositories/write"
import { EmailReadRepositoriesImpl } from "./repositories/read"
import { UserServices } from "../users/services"
import { EmailVersionWriteRepositoriesImpl } from "../emailVersions/repositories/write"
import { AgentEmailService } from "../agent/email/service"
import { emailFromRow, emailToAgentSendInput } from "./factory/email-factory"
import { EmailVersionReadRepositoriesImpl } from "../emailVersions/repositories/read"
import { ProspectReadRepositoriesImpl } from "../prospects/repositories/read"



export const EmailProspectsServicesImpl: EmailProspectsServices = {
    create: async (input: CreateEmailDto) => {
        const validated = emailValidator.validate(input)
        if (!validated.success) {
            throw validated.error
        }
        return await EmailWriteRepositoriesImpl.create(validated.data)

    },

    generate: async (inputs: CreateEmailByProspectIdDto) => {
        const currentUser = await UserServices.getCurrentUser()

        const prospect = await ProspectReadRepositoriesImpl.getWithRelations(inputs.prospectId)

        if (!prospect) {
            throw new Error("Prospect not found")
        }

        const createEmailInput = {
            prospectName: inputs.prospectName ?? prospect.person.fullName,
            prospectEmail: prospect.person.email,
            prospectCompany: inputs.prospectCompany ?? prospect.company.name,
            prospectJob: inputs.prospectJob ?? prospect.person.jobTitle ?? "",
            prospectLocation: inputs.prospectLocation ?? prospect.address.city ?? prospect.address?.country ?? "",
            prospectingConsent: inputs.prospectingConsent ?? true,
        } satisfies CreateEmailDto

        const validated = emailValidator.validate(createEmailInput)
        if (!validated.success) {
            throw validated.error
        }
        const status: EmailStatusValue = "draft"
        // Call Agent Service to generate email content from knowlege base
        const agentResponse = await AgentEmailService.generate(validated.data)

        //Create new version with status draft
        const email = await EmailWriteRepositoriesImpl.create({
            ...validated.data,
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
    generateMany: async (inputs: CreateEmailByProspectIdDto[]) => {

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
        //Update email status to "sent" and save threadId
        const email = await EmailReadRepositoriesImpl.get(id)
        if (!email) {
            throw new Error("Email not found")
        }

        //get latest version
        const latestVersion = await EmailVersionReadRepositoriesImpl.getLatestVersion(email.id)
        if (!latestVersion) {
            throw new Error("Email version not found")
        }

        //send email by Agent service
        const response = await AgentEmailService.sendEmail(emailToAgentSendInput(email, latestVersion))

        await EmailWriteRepositoriesImpl.update({
            id: email.id,
            status: "sent",
            sentAt: new Date(),
            threadId: response.threadId,
        })

        return {
            success: true,
            result: "email sent successfully",
            threadId: response.threadId,

        }
    },

    sendMany: async (ids: string[]) => {
        throw new Error("Method not implemented.")
    },

    regenerate: async (id: string) => {
        const email = await EmailReadRepositoriesImpl.get(id)
        if (!email) {
            throw new Error("Email not found")
        }

        const input = {
            prospectName: email.prospectName,
            prospectCompany: email.prospectCompany,
            prospectJob: email.prospectJob,
            prospectLocation: email.prospectLocation,
            prospectingConsent: email.prospectingConsent,

        }

        const agentResponse = await AgentEmailService.regenerate(input)
        const newVersion = await EmailVersionWriteRepositoriesImpl.create({
            emailId: email.id,
            body: agentResponse.body,
            subject: agentResponse.subject,
            generatedAt: new Date(),
            knowledgeVersion: agentResponse.knowledgeVersion,
        })
        return newVersion
    },
    regenerateMany: async (ids: string[]) => {
        const succeded = []
        const failed = []
        const data: { id: string, subject: string, body: string }[] = []
        try {
            for (const id of ids) {
                try {
                    const version = await EmailProspectsServicesImpl.regenerate(id)
                    data.push(version)
                    succeded.push(id)

                } catch (error) {
                    console.log(error);
                    failed.push(error)
                }
            }
            return { success: true, send: succeded.length, failed: failed.length, data }
        } catch (error) {
            console.log(error);
            return { success: false, send: 0, failed: ids.length, data: [] }
        }
    },

    collections: async (query: any) => {
        return EmailReadRepositoriesImpl.find(query)
    },
    update: async (email) => {
        throw new Error("Method not implemented.")
    },

    updateEmailContent: async (input: Partial<UpdateEmailContentDto>) => {
        const validated = emailValidator.validateUpdateEmailContent(input)
        if (!validated.success) {
            throw validated.error
        }

        const { data } = validated
        const patch: Partial<EmailVersionSqlInfer> = {
            id: data.versionId,
            body: data.body,
            subject: data.subject,
        }

        await EmailVersionWriteRepositoriesImpl.update(patch)
        const email = await EmailWriteRepositoriesImpl.update({ id: data.emailId, prospectEmail: data.recipient })
        return email;
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

