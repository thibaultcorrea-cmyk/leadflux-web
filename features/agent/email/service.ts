import { EmailAgentMock } from "../mocks/email-contents"
import { AgentEmailGenerateOutput, AgentEmailSendInput, AgentEmailSendResult } from "./entities/agentEmail"

export const AgentEmailService = {
    generate: (inputs: any): Promise<AgentEmailGenerateOutput> => {
        return Promise.resolve(EmailAgentMock[0])

    },
    regenerate: async (inputs: any): Promise<AgentEmailGenerateOutput> => {
        const randomIndx = Math.floor(Math.random() * EmailAgentMock.length)
        return Promise.resolve(EmailAgentMock[randomIndx])
    },
    sendEmail: async (input: AgentEmailSendInput): Promise<AgentEmailSendResult> => {
        return Promise.resolve({ success: true, result: "email sent successfully", threadId: crypto.randomUUID(), error: null })
    }

}