"use client";
import { useRef, useEffect, useState } from 'react';

export default function HorizontalScroll(baseItemWidth: number) {
    const ref = useRef<HTMLDivElement>(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(true);
    const [itemWidth, setItemWidth] = useState(baseItemWidth);

    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== "undefined") {
                const width = window.innerWidth;
                if (width < 640) {
                    setItemWidth(baseItemWidth / 3); 
                } else {
                    setItemWidth(baseItemWidth);
                }
            }
            if(baseItemWidth < 449) {
                setItemWidth(baseItemWidth-120);
            }
        };

        handleResize(); 
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [baseItemWidth]);

    const checkScroll = () => {
        if (ref.current) {
            const { scrollLeft, scrollWidth, clientWidth } = ref.current;
            setCanLeft(scrollLeft > 0);
            setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
        }
    };

    useEffect(() => {
        const container = ref.current;
        if (!container) return;
        container.addEventListener('scroll', checkScroll);
        checkScroll();
        return () => container.removeEventListener('scroll', checkScroll);
    }, []);

    const scrollLeftByOne = () => {
        if (!ref.current) return;
        const { scrollLeft } = ref.current;
        if (scrollLeft <= itemWidth + 100) {
            ref.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            ref.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        }
    };

    const scrollRightByOne = () => {
        if (!ref.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = ref.current;
        const maxScrollLeft = scrollWidth - clientWidth;
        if (scrollLeft + itemWidth >= maxScrollLeft - 100) {
            ref.current.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
        } else {
            ref.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    };

    return { ref, canLeft, canRight, scrollLeftByOne, scrollRightByOne };
}