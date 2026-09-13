import { UploadsServicesImpl } from "@/features/uploads/services";
import { errorApiHandler } from "@/lib/handler";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

export const dynamic = "force-dynamic"


interface IProps {
    params: Promise<{ path: string; filename: string }>
}

export const GET = async (request: NextRequest, { params }: IProps) => {
    try {
        const { path, filename } = await params
        const key = `${path}/${filename}`
        const { stream, file } = await UploadsServicesImpl.readByPathPublic(key)
        return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
            headers: {
                "Content-Type": file.type,
                "Content-Length": file.size.toString(),
                "Content-Disposition": `inline; filename="${filename}"`
            }
        })
    } catch (error) {
        return errorApiHandler(error)
    }
}
