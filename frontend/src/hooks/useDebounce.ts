import { useEffect, useRef, useState } from "react";

export function useDebounce<T>(value: T, def: T, delay: number = 700,) {
    const [deboucedValue, setDebouncedValue] = useState<T>(def);
    const timeRef = useRef<number>();

    useEffect(() => {
        timeRef.current = setTimeout(() => setDebouncedValue(value), delay);
        return () => {
            clearTimeout(timeRef.current);
        };
    }, [value, delay])
    return deboucedValue;
}