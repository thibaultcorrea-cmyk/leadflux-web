

export const mapLastKnowledgeBase = (knowledgeBase: any) => {
    return {
        id: knowledgeBase.id,
        name: knowledgeBase.name,
        number: 0,
        file: {
            id: knowledgeBase.file.id,
            originalName: knowledgeBase.file.originalName,
            size: knowledgeBase.file.size,
            key: knowledgeBase.file.key,
            path: knowledgeBase.file.path,
            type: knowledgeBase.file.type,
            extension: knowledgeBase.file.extension
        },
        totalIndexed: knowledgeBase.totalIndexed ?? 0,
        countWords: knowledgeBase.countWords ?? 0,
        indexedBy: {
            name: knowledgeBase.indexer.name,
            image: knowledgeBase.indexer.image
        },
        createdAt: knowledgeBase.createdAt.toISOString(),
        updatedAt: knowledgeBase.updatedAt.toISOString()
    }
}