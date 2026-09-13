"use client"

import { useQuery } from "@tanstack/react-query"
import { KNOWLEDGE_BASE_QUERIES_KEYS } from "../services/queries"
import { fetchCurrentKnowledgeBaseApi } from "../services/api-service"
import { KnowledgeBaseFile, KnowledgeBaseFileType, KnowledgeBaseVersion } from "../../../../types/knowledge-base"
import { formatLongDate, formatLongDateTime, formatRelativeTime } from "@/lib/date-format"
import { formatFileSize } from "@/lib/utils"

const unknownData = "non renseigné"

export const useFetchCurrentKnowledgeBase = () => {

    const { data, ...rest } = useQuery({
        queryKey: [KNOWLEDGE_BASE_QUERIES_KEYS.GET_LAST_KNOWLEDGE_BASE],
        queryFn: fetchCurrentKnowledgeBaseApi
    })

    const createdAt = data?.lastKnowledgeVersion?.createdAt
    const fileSize = data?.lastKnowledgeVersion?.file?.size

    const currentVersion = {
        name: data?.lastKnowledgeVersion?.name ?? "",
        indexedAtLabel: createdAt ? formatLongDate(createdAt) : unknownData,
        author: data?.lastKnowledgeVersion?.indexedBy?.name ?? "Utilisateur inconnu"
    } satisfies KnowledgeBaseVersion


    const currentKnowledgeBaseFile = {
        name: data?.lastKnowledgeVersion?.file?.originalName ?? unknownData,
        type: data?.lastKnowledgeVersion?.file?.extension as any,
        sizeLabel: fileSize ? formatFileSize(fileSize) : unknownData,
        uploadedAtLabel: createdAt ? formatLongDate(createdAt) : unknownData,
        uploadedAtDatetime: createdAt ? formatLongDateTime(createdAt) : unknownData,
        wordCount: data?.lastKnowledgeVersion?.countWords ?? 0,
        totalIndexed: data?.lastKnowledgeVersion?.totalIndexed ?? 0,
        distanceDateTime: createdAt ? formatRelativeTime(createdAt) : "",
        previewUrl: data?.lastKnowledgeVersion?.file?.path ?? "",
        extractedText: ""
    } satisfies KnowledgeBaseFile

    return {
        data: data?.lastKnowledgeVersion,
        currentVersion,
        currentKnowledgeBaseFile,
        ...rest
    }

}