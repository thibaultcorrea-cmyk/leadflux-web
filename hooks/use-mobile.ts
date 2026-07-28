import * as React from "react"

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

export function useIsMobile() {
  // useSyncExternalStore plutôt qu'un useEffect + setState : la media query est
  // une source externe, la lire en snapshot évite les rendus en cascade.
  // Snapshot serveur à `false` : matchMedia n'existe pas au rendu SSR.
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  )
}
