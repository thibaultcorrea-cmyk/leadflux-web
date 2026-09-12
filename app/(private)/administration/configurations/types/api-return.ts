
export type LastKnowledgeBaseApiReturn = {
    name: string;
    countWords: number;
    totalIndexed: number;
    file: {
        originalName: string;
        path: string;
        size: number;
        extension: string;
    };
    indexedBy: {
        name: string;
        image: string;
    };
    createdAt: string;
}