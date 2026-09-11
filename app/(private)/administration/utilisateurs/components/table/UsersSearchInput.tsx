"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UsersSearchInputProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export function UsersSearchInput({ value, onValueChange }: UsersSearchInputProps) {
  return (
    <div className="relative w-full max-w-64">
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-500"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder="Rechercher un utilisateur"
        aria-label="Rechercher un utilisateur par nom ou email"
        className="h-9 pr-8 pl-8"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Effacer la recherche"
          onClick={() => onValueChange("")}
          className="absolute top-1/2 right-1 -translate-y-1/2 text-ink-500"
        >
          <X className="size-3.5" aria-hidden />
        </Button>
      )}
    </div>
  );
}
