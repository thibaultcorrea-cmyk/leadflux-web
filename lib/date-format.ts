
export const formatDate = (date: Date) => {
    return date.toISOString()
}

/**
 * Libellé long en français ("12 août 2026"), utilisé pour les dates
 * affichées telles quelles (fichier importé le, version indexée le…), par
 * opposition à `formatRelativeTime` qui reste relatif au moment présent.
 */
export const formatLongDate = (date: Date | string) => {
    const target = typeof date === "string" ? new Date(date) : date
    // timeZone: "UTC" fige la date affichée sur celle stockée (souvent une
    // simple date "YYYY-MM-DD", interprétée en UTC) : sans ça, un fuseau
    // local en arrière sur UTC ferait glisser l'affichage d'un jour.
    return target.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
}

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30 * DAY
const YEAR = 365 * DAY

/**
 * Libellé relatif court ("à l'instant", "12 min", "3 h", "2 j", "3 mois",
 * "1 an") pour les colonnes de type "dernière activité". Calculé côté front,
 * jamais stocké : un libellé figé en base deviendrait faux dès l'instant
 * suivant.
 */
export const formatRelativeTime = (date: Date | string) => {
    const target = typeof date === "string" ? new Date(date) : date
    const diffMs = Date.now() - target.getTime()

    if (diffMs < MINUTE) return "à l'instant"
    if (diffMs < HOUR) return `${Math.floor(diffMs / MINUTE)} min`
    if (diffMs < DAY) return `${Math.floor(diffMs / HOUR)} h`
    if (diffMs < MONTH) return `${Math.floor(diffMs / DAY)} j`
    if (diffMs < YEAR) return `${Math.floor(diffMs / MONTH)} mois`

    const years = Math.floor(diffMs / YEAR)
    return years === 1 ? "1 an" : `${years} ans`
}

/**
 * Returns the current date and time in ISO format.
 * @returns {string} The current date and time in ISO format.
 */
export const dateNowIsoString = () => {
    const dt = new Date()
    return dt.toISOString()
}


export const formatRelativeTimeFromTimestamp = (timestamp: string) => {
    const date = new Date(Number(timestamp))
    return formatRelativeTime(date)
}