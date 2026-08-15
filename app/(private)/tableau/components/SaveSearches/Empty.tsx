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
                    Ajoutez une recherche pour commencer
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
                <Button>Nouvelle recherche</Button>
                <Button variant="outline">Prospects enregistrés</Button>
            </EmptyContent>

        </Empty>
    );
}
