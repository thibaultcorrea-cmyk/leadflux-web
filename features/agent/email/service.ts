import { ProspectServicesImpl } from "@/features/prospects/services"
import { EmailAgentMock } from "../mocks/email-contents"
import { AgentEmailGenerateApiInput, AgentEmailGenerateOutput, AgentEmailSendInput, AgentEmailSendResult } from "./entities/agentEmail"
import { AgentEmailWriteRepository } from "./repositories/write"
import { TProspectWithRelations } from "@/features/prospects/entities/type"
import { CreateEmailDto } from "@/features/emails/dto/schema"

export const AgentEmailService = {
    generate: async (inputs: CreateEmailDto): Promise<AgentEmailGenerateOutput> => {

        const prospect = await ProspectServicesImpl.find(inputs.prospectId)
        const payload: AgentEmailGenerateApiInput = mapProspectFromRelationsToPayload(prospect)
        const result = await AgentEmailWriteRepository.generate(payload)
        const { subject, content } = result

        return {
            subject,
            body: content,
            knowledgeVersion: "1.0.0"
        }


    },
    regenerate: async (inputs: any): Promise<AgentEmailGenerateOutput> => {
        const randomIndx = Math.floor(Math.random() * EmailAgentMock.length)
        return Promise.resolve(EmailAgentMock[randomIndx])
    },
    sendEmail: async (input: AgentEmailSendInput): Promise<AgentEmailSendResult> => {
        return Promise.resolve({ success: true, result: "email sent successfully", threadId: crypto.randomUUID(), error: null })
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
