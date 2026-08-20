
export type AgentEmailGenerateOutput = {
    subject: string;
    body: string;
    knowledgeVersion: string;
}

export type AgentEmailSendInput = {
    subject: string;
    body: string;
    recipient: string;

}


export type AgentEmailSendResult = {
    success: boolean;
    result: string;
    threadId: string | null;
}
