import { EmailVersion } from "../types/email"

export const getLastVersion = (versions: EmailVersion[]) => {
    const length = versions.length
    return versions[length - 1]
}