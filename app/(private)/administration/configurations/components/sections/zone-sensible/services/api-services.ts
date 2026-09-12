export const resetApplication = async () => {
    const response = await fetch("/api/v1/hard-reset", {
        method: "POST",
    })
    const data = await response.json()

    if (!response.ok) {
        throw data
    }
    return data as { success: boolean }
}