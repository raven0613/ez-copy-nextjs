import { useEffect } from "react";

export default function useClosePanel(callback: () => void) {
    useEffect(() => {
        document.addEventListener("click", callback);
        return () => document.removeEventListener("click", callback);
    }, [callback]);
}
