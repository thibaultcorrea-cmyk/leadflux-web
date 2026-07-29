
"use client"

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { User } from "lucide-react"

const SideBarFooterMenu = () => {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton>
                    <User />
                    User
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default SideBarFooterMenu