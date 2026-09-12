import { NextRequest, NextResponse } from "next/server"
import { KnowledgeBaseServicesImpl } from "@/features/knowledge-bases/services"
import { errorApiHandler } from "@/lib/handler"

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json()
        const created = await KnowledgeBaseServicesImpl.create(body)
        return NextResponse.json(created, { status: 201 })
    } catch (error) {
        return errorApiHandler(error)
    }
}
