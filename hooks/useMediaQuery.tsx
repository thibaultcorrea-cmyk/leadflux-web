"use client"

import { useCallback, useSyncExternalStore } from 'react';

export function useMediaQuery(query: string) {
    // useSyncExternalStore plutôt qu'un useEffect + setState : la media query est
    // une source externe, la lire en snapshot évite les rendus en cascade.
    const subscribe = useCallback(
        (onChange: () => void) => {
            const result = matchMedia(query);
            result.addEventListener('change', onChange);

            return () => result.removeEventListener('change', onChange);
        },
        [query]
    );

    // Snapshot serveur à `false` : matchMedia n'existe pas au rendu SSR.
    return useSyncExternalStore(
        subscribe,
        () => matchMedia(query).matches,
        () => false
    );
}
