

export type LastKnowledgeBase = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    fileId: string;
    indexedBy: string | null;
    status: "error" | "processing" | "indexed";
    errorMessage: string | null;
    totalIndexed: number | null;
    countWords: number | null;
    file: {
        id: string;
        extension: string;
        size: number;
        type: string;
        path: string;
        originalName: string;
        createdAt: Date;
        updatedAt: Date;
    };
    indexer: {
        id: string;
        name: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        isAdmin: boolean | null;
    }
} | undefined
