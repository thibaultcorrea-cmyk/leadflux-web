import { ProspectServicesImpl } from "@/features/prospects/services"
import { EmailAgentMock } from "../mocks/email-contents"
import { AgentEmailGenerateApiInput, AgentEmailGenerateOutput, AgentEmailSendInput, AgentEmailSendResult } from "./entities/agentEmail"
import { AgentEmailWriteRepository } from "./repositories/write"
import { TProspectWithRelations } from "@/features/prospects/entities/type"
import { CreateEmailDto } from "@/features/emails/dto/schema"
import { SMTPServiceImpl } from "@/features/smtp/services"
import { SendEmailDto } from "@/features/smtp/dto/schema"
import { EmailProspectsServicesImpl } from "@/features/emails/services"
import { EmailReadRepositoriesImpl } from "@/features/emails/repositories/read"

export const AgentEmailService = {
    generate: async (inputs: CreateEmailDto): Promise<AgentEmailGenerateOutput> => {

        const prospect = await ProspectServicesImpl.find(inputs.prospectId)
        const payload: AgentEmailGenerateApiInput = mapProspectFromRelationsToPayload(prospect)
        const result = await AgentEmailWriteRepository.generate(payload)
        const { subject, content } = result

        return {
            subject,
            body: content,
            knowledgeVersion: "1.0.0",
            payload
        }


    },
    regenerate: async (emailId: string): Promise<AgentEmailGenerateOutput> => {
        const email = await EmailReadRepositoriesImpl.get(emailId)
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
            knowledgeVersion: "1.0.0",
            payload
        }
    },
    sendEmail: async (input: AgentEmailSendInput): Promise<AgentEmailSendResult> => {
        const payload = {
            to: input.to,
            subject: input.subject,
            html: input.body,
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
