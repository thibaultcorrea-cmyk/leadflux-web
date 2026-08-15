"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { CardHeader, CardContent } from "@/components/ui/card";

export const RecentActivityLoading = () => {
    return (
        <Card className="gap-3.5 ring-border [--card-spacing:--spacing(5)]">
            <CardHeader className="">
                <Skeleton className="h-10 w-full" />

            </CardHeader>
            <CardContent>
                <Skeleton className="h-[25vh]" />
            </CardContent>
        </Card>
    );
};