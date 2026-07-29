"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AppSidebarUser } from "./app-sidebar";
import DropdownLayer from "../Dropdown/DropdownLayer";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CreditCardIcon, SettingsIcon, UserIcon } from "lucide-react";
import { LogoutButton } from "../Buttons/LogoutButtons";
import { useIsMobile } from "@/hooks/use-mobile";





const Trigger = ({ user }: { user: AppSidebarUser }) => {
    return (<button type="button" className="flex items-center gap-2.5 rounded-md bg-sidebar-accent p-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:bg-transparent cursor-pointer">
        <Avatar className="size-7.5 after:border-transparent">
            <AvatarFallback className="bg-primary-400 text-xs font-semibold text-sidebar-foreground">
                {user.initials}
            </AvatarFallback>
        </Avatar>
        <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-[13px] font-medium text-sidebar-foreground">
                {user.name}
            </p>
            <p className="truncate text-[11px] text-secondary-300">
                {user.role}
            </p>
        </div>
    </button>)
}


const UserDropDown = ({ user }: { user: AppSidebarUser }) => {

    const mobile = useIsMobile()
    return (
        <DropdownLayer trigger={Trigger({ user })} align={mobile ? "center" : "end"} side={mobile ? "top" : "right"}>
            <DropdownMenuItem>
                <UserIcon />
                Profile
            </DropdownMenuItem>

            <DropdownMenuItem>
                <SettingsIcon />
                Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
                <LogoutButton />
            </DropdownMenuItem>

        </DropdownLayer>
    )
}

export default UserDropDown;