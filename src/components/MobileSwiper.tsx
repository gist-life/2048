import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";

export type SwipeInput = {
    deltaX: number,
    deltaY: number
};

export function MobileSwiper({ children, onSwipe }: PropsWithChildren<{ onSwipe: (_: SwipeInput) => void }>) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    
    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (!wrapperRef.current?.contains(e.target as Node))
            return;

        e.preventDefault();

        setStartX(e.touches[0].clientX);
        setStartY(e.touches[0].clientY);
    }, []);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        if (!wrapperRef.current?.contains(e.target as Node))
            return;

        e.preventDefault();

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        onSwipe({ deltaX: endX - startX, deltaY: endY - startY });
        
        setStartX(0);
        setStartY(0);
    }, [onSwipe, startX, startY]);

    useEffect(() => {
        window.addEventListener("touchstart", handleTouchStart, { passive: false });
        window.addEventListener("touchend", handleTouchEnd, { passive: false });
        
        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        }
    }, [handleTouchEnd, handleTouchStart]);
    
    return (
        <div ref={wrapperRef}>
            {children}
        </div>
    );
}