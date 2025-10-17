"use client";
import { check } from 'prettier';
import { useRef, useEffect, useState } from 'react';

export default function HorizontalScroll(baseItemWidth: number, numOfItem: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [itemWidth, setItemWidth] = useState(baseItemWidth);

  // 🧩 ฟังก์ชันตรวจ scroll ซ้าย/ขวา
  const checkScroll = () => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScrollLeft = scrollWidth - clientWidth;
    const tolerance = 5;
    setCanLeft(scrollLeft > tolerance);
    setCanRight(scrollLeft < maxScrollLeft - tolerance);
  };

  // 🧩 Resize listener ปรับ itemWidth และตรวจ scroll
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setItemWidth(baseItemWidth / numOfItem);
      else setItemWidth(baseItemWidth);
      if (baseItemWidth < 449) setItemWidth(baseItemWidth - 120);
      checkScroll();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [baseItemWidth]);

  // 🧩 Scroll listener + Observer + Loop ตรวจ scrollWidth จริง
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll);
    const updateAfterLoad = () => checkScroll();
    setTimeout(updateAfterLoad, 0);

    const resizeObs = new ResizeObserver(() => checkScroll());
    resizeObs.observe(el);

    const mutationObs = new MutationObserver(() => checkScroll());
    mutationObs.observe(el, { childList: true, subtree: true });

    window.addEventListener('resize', updateAfterLoad);

    // ✅ NEW: loop ตรวจ scrollWidth เปลี่ยน (เช็กทุก frame)
    let lastScrollWidth = el.scrollWidth;
    const loopCheck = () => {
      if (el.scrollWidth !== lastScrollWidth) {
        lastScrollWidth = el.scrollWidth;
        checkScroll();
      }
      requestAnimationFrame(loopCheck);
    };
    requestAnimationFrame(loopCheck);

    // ✅ ตรวจหลังภาพโหลด
    const imgs = el.querySelectorAll("img");
    if (imgs.length > 0) {
      let loaded = 0;
      const handleImgLoad = () => {
        loaded++;
        if (loaded === imgs.length) setTimeout(checkScroll, 200);
      };
      imgs.forEach((img) => {
        if (img.complete) handleImgLoad();
        else img.addEventListener("load", handleImgLoad);
      });
    }

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', updateAfterLoad);
      resizeObs.disconnect();
      mutationObs.disconnect();
    };
  }, []);

  // 🧩 Scroll control
  const scrollLeftByOne = () => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    waitForScrollEnd(el, checkScroll);
  };

  const scrollRightByOne = () => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScrollLeft = scrollWidth - clientWidth;
    const tolerance = 5;

    if (scrollLeft + itemWidth >= maxScrollLeft - tolerance) {
      el.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }
    waitForScrollEnd(el, checkScroll);
  };

  function waitForScrollEnd(el: HTMLElement, callback: () => void, timeout = 100) {
    let isScrolling: NodeJS.Timeout;
    el.addEventListener("scroll", () => {
      clearTimeout(isScrolling);
      isScrolling = setTimeout(() => callback(), timeout);
    });
  }

  return { ref, canLeft, canRight, scrollLeftByOne, scrollRightByOne , checkScroll };
}

