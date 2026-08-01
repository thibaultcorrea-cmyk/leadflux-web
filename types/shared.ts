
export interface DateFilter {
    startDate?: Date;
    endDate?: Date;

}


export interface PaginationFilter {
    page: number;
    pageSize: number;
    orderBy?: string;
    orderDirection?: string;
    search?: string;
}

export type Filter = DateFilter & PaginationFilter


export interface RepositoryRead {
    all: (filters?: Filter) => Promise<any[]>;
    byId: (id: string) => Promise<any>;
    count: (filters?: Filter) => Promise<number>;
    search: (query: string) => Promise<any[]>;
}

export interface RepositoryWrite {
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
    deleteInBulk: (ids: string[]) => Promise<any>;
    softDelete?: (id: string) => Promise<any>;
    softDeleteInBulk?: (ids: string[]) => Promise<any>;
}