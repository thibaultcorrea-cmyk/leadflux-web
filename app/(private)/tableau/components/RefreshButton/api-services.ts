
export const fetchScanReply = async () => {

    const res = await fetch('/api/v1/emails/scan-replies', {
        method: "POST"
    })

    const json = await res.json()
    if (!res.ok) {
        console.log(json)
        throw new Error("Failed to fetch scan reply")
    }

    return json

}