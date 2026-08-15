

export type SearchServices = {
    create: (prospect: any) => Promise<any>
    collections: (query: any) => Promise<any[]>
    update: (prospect: Partial<any>) => Promise<any>
    delete: (id: string) => Promise<void>
    deleteMultiple: (id: string[]) => Promise<void>
    truncate: () => Promise<void>

}
