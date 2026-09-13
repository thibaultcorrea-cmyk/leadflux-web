import { NextRequest, NextResponse } from "next/server"
import { KnowledgeBaseServicesImpl } from "@/features/knowledge-bases/services"
import { errorApiHandler } from "@/lib/handler"
import { AgentDocumentServiceImpl } from "@/features/agent/documents/services"

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json()
        // Demarrer le traitement d'indexation 
        const ingestData = await AgentDocumentServiceImpl.ingestDocuments(body)
        body.totalIndexed = ingestData.totalIndexed
        body.countWords = ingestData.wordsCount
        body.status = ingestData.status
        const created = await KnowledgeBaseServicesImpl.create(body)
        return NextResponse.json(created, { status: 201 })
    } catch (error) {
        return errorApiHandler(error)
    }
}
