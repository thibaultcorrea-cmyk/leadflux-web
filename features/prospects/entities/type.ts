
export type TProspectWithRelations = {
    id: string
    company: {
        id: string
        name: string
        description: string
        website: string
        industry: string
        size: string
    }
    person: {
        id: string
        fullName: string
        email: string
        linkedinUrl: string
        phone: string
        jobTitle: string
    },
    address: {
        id: string
        city?: string
        country?: string
        zipCode?: string
        state?: string
        street?: string
    }

}
