"use client"
import {
    ActionBar,
    ActionBarSelection,
    ActionBarSeparator,
    ActionBarGroup,
    ActionBarItem,
    ActionBarClose,
} from "@/components/ui/action-bar";

interface DataTableActionBarProps {
    open: boolean
    count: number
    onClearSelection?: () => void
}

export const DataTableActionBar = ({ open, count, onClearSelection }: DataTableActionBarProps) => {
    return (
        <ActionBar>
            <ActionBarSelection />
            <ActionBarSeparator />
            <ActionBarGroup>
                <ActionBarItem />
                <ActionBarItem />
            </ActionBarGroup>
            <ActionBarClose />
        </ActionBar>
    )
}