

export type ProspectServices = {
    create: (prospect: any) => Promise<any>
    collections: () => Promise<any[]>
    update: (prospect: Partial<any>) => Promise<any>
    delete: (id: string) => Promise<void>
    deleteMultiple: (id: string[]) => Promise<void>
    truncate: () => Promise<void>
    search: (query: any) => Promise<any[]>

}
