"use client"
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Save, Search } from "lucide-react";


export default function EmptySaveSearches() {
    return (
        <Empty>
            <EmptyMedia variant="icon">
                <Search />
            </EmptyMedia>

            <EmptyHeader>
                <EmptyTitle>Recherches sauvegardées</EmptyTitle>
                <EmptyDescription>
                    Aucune recherche sauvegardée pour le moment.
                </EmptyDescription>
            </EmptyHeader>


        </Empty>
    );
}
