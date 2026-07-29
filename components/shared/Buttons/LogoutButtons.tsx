"use client"

import { useAuthenticationClient } from "@/hooks/useAuthenticationClient"
import { cn } from "@/lib/utils"
import { LogOutIcon } from "lucide-react"

export const LogoutButton = ({ className }: { className?: string }) => {

    const { signOut } = useAuthenticationClient()


    return <button type="button" onClick={signOut} className={cn('flex items-center gap-2 p-0.5 cursor-pointer', className)} >
        <LogOutIcon />
        Se déconnecter
    </button>
}
