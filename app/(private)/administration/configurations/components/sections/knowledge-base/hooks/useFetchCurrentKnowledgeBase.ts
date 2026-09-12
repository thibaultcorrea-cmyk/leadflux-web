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

    const currentVersion = {
        name: data?.lastKnowledgeVersion?.name ?? "",
        indexedAtLabel: formatLongDate(data?.lastKnowledgeVersion?.createdAt ?? "") ?? unknownData,
        author: data?.lastKnowledgeVersion?.indexedBy?.name ?? "Utilisateur inconnu"
    } satisfies KnowledgeBaseVersion


    const currentKnowledgeBaseFile = {
        name: data?.lastKnowledgeVersion?.file?.originalName ?? unknownData,
        type: data?.lastKnowledgeVersion?.file?.extension as any,
        sizeLabel: formatFileSize(data?.lastKnowledgeVersion?.file?.size ?? 0) ?? unknownData,
        uploadedAtLabel: formatLongDate(data?.lastKnowledgeVersion.createdAt ?? "") ?? unknownData,
        uploadedAtDatetime: formatLongDateTime(data?.lastKnowledgeVersion.createdAt ?? "") ?? unknownData,
        distanceDateTime: formatRelativeTime(data?.lastKnowledgeVersion.createdAt ?? "") ?? "",
        wordCount: data?.lastKnowledgeVersion?.countWords ?? 0,
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