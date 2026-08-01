"use client"


export const CardSkeleton = () => {

    return (
        <div className="flex flex-col items-center justify-center gap-2 animate-pulse bg-accent rounded-lg p-4 min-h-42 w-full"></div>
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
