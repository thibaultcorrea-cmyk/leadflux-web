"use client"

import useFetchSaveSearches from "../../_hooks/useFetchSaveSearches";
import { SavedSearchReturn } from "../../types/tableau";
import EmptySaveSearches from "./Empty";
import { SavedSearchSectionLoading } from "./Loading";

const SavedSearchItem = ({ search }: { search: SavedSearchReturn }) => {
    return (
        <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-md border border-border bg-background-100 px-3 py-2.5 text-left transition-colors outline-none hover:bg-background-200 focus-visible:ring-2 focus-visible:ring-ring"
        >
            <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium text-ink-900">
                    {search.name}
                </span>
                <span className="block truncate text-[11px] text-ink-500">
                    {search.criteria}
                </span>
            </span>
            <span className="text-[13px] font-semibold text-ink-700 tabular-nums">
                {search.count}
            </span>
        </button>
    );
}

const SavedSearchList = () => {
    const { savedSearches, isError, isLoading } = useFetchSaveSearches();
    if (isLoading) return <SavedSearchSectionLoading count={10} />
    if (savedSearches.length === 0) return <EmptySaveSearches />
    return (
        <ul className="flex flex-col gap-2.5">
            {savedSearches.map((search) => (
                <li key={search.id}>
                    <SavedSearchItem search={search} />
                </li>
            ))}
        </ul>
    );
}

export default SavedSearchList