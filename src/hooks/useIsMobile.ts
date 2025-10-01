import { useEffect, useState } from "react";

const QUERY = "(max-width: 507px)";

export default function useIsMobile() {
  const getMatch = () =>
    typeof window !== "undefined" ? window.matchMedia(QUERY).matches : false;

  const [isMobile, setIsMobile] = useState(getMatch);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(QUERY);
    const handler = () => setIsMobile(mql.matches);
    handler(); // sync on mount
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  return isMobile;
}