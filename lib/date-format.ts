
export const formatDate = (date: Date) => {
    return date.toISOString()
}

/**
 * Returns the current date and time in ISO format.
 * @returns {string} The current date and time in ISO format.
 */
export const dateNowIsoString = () => {
    const dt = new Date()
    return dt.toISOString()
}