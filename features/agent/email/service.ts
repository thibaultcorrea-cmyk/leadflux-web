import { ProspectServicesImpl } from "@/features/prospects/services"
import { AgentEmailGenerateApiInput, AgentEmailGenerateOutput, AgentEmailSendInput, AgentEmailSendResult } from "./entities/agentEmail"
import { AgentEmailWriteRepository } from "./repositories/write"
import { TProspectWithRelations } from "@/features/prospects/entities/type"
import { CreateEmailDto } from "@/features/emails/dto/schema"
import { SMTPServiceImpl } from "@/features/smtp/services"
import { SendEmailDto } from "@/features/smtp/dto/schema"
import { EmailReadRepositoriesImpl } from "@/features/emails/repositories/read"
import { renderProspectEmailHtml } from "@/features/emails/templates/render-email-html"
import { KnowledgeBaseServicesImpl } from "@/features/knowledge-bases/services"

const UNKNOWN_VERSION = "Version non renseignée"

export const AgentEmailService = {
    generate: async (inputs: CreateEmailDto): Promise<AgentEmailGenerateOutput> => {

        const prospect = await ProspectServicesImpl.find(inputs.prospectId)
        const knowledgeBase = await KnowledgeBaseServicesImpl.getLastKnowledgeVersion()
        const payload: AgentEmailGenerateApiInput = mapProspectFromRelationsToPayload(prospect)
        const result = await AgentEmailWriteRepository.generate(payload)
        const { subject, content } = result

        return {
            subject,
            body: content,
            knowledgeVersion: knowledgeBase.name ?? UNKNOWN_VERSION,
            payload
        }


    },
    regenerate: async (emailId: string): Promise<AgentEmailGenerateOutput> => {
        const email = await EmailReadRepositoriesImpl.get(emailId)
        const knowledgeBase = await KnowledgeBaseServicesImpl.getLastKnowledgeVersion()

        if (!email) {
            throw new Error("Email not found")
        }

        const payload = email.generationInput
        if (!payload) {
            throw new Error("No payload found for this email")
        }

        const result = await AgentEmailWriteRepository.generate(payload)
        const { subject, content } = result

        return {
            subject,
            body: content,
            knowledgeVersion: knowledgeBase.name ?? UNKNOWN_VERSION,
            payload
        }
    },
    sendEmail: async (input: AgentEmailSendInput): Promise<AgentEmailSendResult> => {
        const logo = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/logo`
        const html = await renderProspectEmailHtml(input.body, logo)

        const payload = {
            to: input.to,
            subject: input.subject,
            html,
        } as SendEmailDto


        const result = await SMTPServiceImpl.send(payload)

        return { success: true, result: "email sent successfully", threadId: result.messageId, }
    }

}



const mapProspectFromRelationsToPayload = (prospect: TProspectWithRelations): AgentEmailGenerateApiInput => {
    return {
        person: {
            name: prospect.person.fullName,
            jobTitle: prospect.person.jobTitle,
        },
        company: {
            name: prospect.company.name,
            description: prospect.company.description,
            industry: prospect.company.industry,
            size: prospect.company.size,
            keywords: [],
            address: {
                city: prospect.address.city,
                country: prospect.address.country,
            },

        },

    }

}
