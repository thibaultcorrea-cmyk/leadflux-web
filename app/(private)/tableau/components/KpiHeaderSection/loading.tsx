"use client"

import { Skeleton } from "@/components/ui/skeleton";


export const CardSkeleton = () => {

    return (
        <Skeleton className="min-h-32 w-full rounded-lg" />

    );


}



export const KpiSectionLoading = ({ count = 4 }: { count?: number }) => {
    return (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <li key={i}>
                    <CardSkeleton />
                </li>
            ))}
        </ul>
    );
}
