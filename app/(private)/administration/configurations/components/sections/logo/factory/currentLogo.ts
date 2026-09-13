import { formatLongDateTime } from "@/lib/date-format"
import { LogoFile } from "../../../../types/logo"
import { formatFileSize } from "@/lib/utils"

export const currentLogoFileFactoryFromQuery = (query: any): LogoFile => {

    const url = `/api/v1/logo`

    return {
        name: query.name,
        sizeLabel: formatFileSize(query.size),
        widthPx: query.width,
        heightPx: query.height,
        url: query.url ?? url,
        uploadedAtLabel: formatLongDateTime(query.createdAt),

    }

}