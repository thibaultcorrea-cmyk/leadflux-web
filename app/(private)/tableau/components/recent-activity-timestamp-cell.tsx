
"use client"


import { formatRelativeTimeFromTimestamp } from "@/lib/date-format";
import { RecentActivityRow } from "../types/tableau";

export const RecentActivityTimestampCell = ({ item }: { item: RecentActivityRow }) => {

    const formattedTimestamp = formatRelativeTimeFromTimestamp(item.timestamp)

    return (
        <span className="text-[13px] text-ink-500">
            il y a {formattedTimestamp}
        </span>
    )
}