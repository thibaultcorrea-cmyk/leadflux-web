"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentCompanyLogo } from "@/hooks/useCurrentCompanyLogo"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

const LOGO_URL = "/api/v1/logo"



export const BrandIcon = ({ Icon, className }: { Icon?: LucideIcon, className?: string }) => {
    const { data: currentLogo, isPending: isLoading } = useCurrentCompanyLogo()

    const DefaultIcon = Icon;

    if (isLoading) return <LogoSkeleton />

    if (currentLogo?.key) {
        return (
            <div key={currentLogo?.key} className="relative  size-8 flex items-center justify-cente">
                <img src={`${LOGO_URL}`} alt={`current logo of your company`} className={cn("w-full rounded", className)} width={256} height={256} />
            </div>
        )
    }
    if (DefaultIcon && !isLoading) {
        return <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-accent">
            <DefaultIcon className={className} />
        </span>

    }

    return null;
}


export const LogoSkeleton = () => <Skeleton className="size-10 bg-sidebar-accent rounded" />