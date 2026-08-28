
export type AgentEmailGenerateOutput = {
    subject: string;
    body: string;
    knowledgeVersion: string;
}

export type AgentEmailSendInput = {
    subject: string;
    body: string;
    to: string;

}


export type AgentEmailSendResult = {
    success: boolean;
    result: string;
    threadId: string | null;
}



export type AgentEmailGenerateApiInput = {
    person: {
        name: string;
        jobTitle: string;
    },
    company: {
        name: string;
        industry: string;
        description: string;
        keywords?: string[];
        size?: string;
        technologies?: string[];
        address?: {
            city?: string;
            country?: string;
        }
    }

}


export type AgentEmailGenerateApiOutput = {
    status: string;
    entreprise: string;
    subject: string;
    content: string;
}

export type AgentEmailGenerateInputs = {
    prospectId: string;
    prospectName: string;
    prospectJob: string;
    prospectCompany: string;
    prospectEmail: string;
    prospectLocation: string;
    prospectingConsent: boolean;

}