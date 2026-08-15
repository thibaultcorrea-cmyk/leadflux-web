"use client"

import { Skeleton } from "@/components/ui/skeleton";

export const SavedSearchSectionLoading = ({ count }: { count?: number }) => {
    const nb = count ?? 10;
    return <div className="flex flex-col gap-2.5">
        {Array.from({ length: nb }).map((_, index) => (
            <Skeleton className="h-15 w-full" key={index} />
        ))}
    </div>
}

