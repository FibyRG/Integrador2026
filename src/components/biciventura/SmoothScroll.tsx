"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // Check if we are on client side and not on mobile (optionally keep it on mobile if high performance)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Buttery easeOutQuart
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.05,
    });

    // RAF Loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Override smooth-scroll anchor clicks globally
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Support nested tags in links (like spans or SVG icons inside a link)
      const link = target.closest("a");
      if (link && link.hash && link.origin === window.location.origin) {
        const targetElement = document.querySelector(link.hash);
        if (targetElement) {
          e.preventDefault();
          // Lenis scrollTo gives a highly premium inertial scroll to the section
          lenis.scrollTo(targetElement, { 
            offset: -60, // Accommodate sticky header
            duration: 1.6,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }
      }
    };

    // Override button smooth scrolls by query selector as well
    const handleBtnClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("button");
      if (btn) {
        // If a button has an onClick that performs manual scroll, we can override or hook it
        // Our project components use querySelector("#reservar").scrollIntoView() which is standard,
        // but Lenis will automatically intercept or we can let Lenis handle it if they click buttons
      }
    };

    // Listen globally for smooth scroll links
    document.addEventListener("click", handleAnchorClick);

    // Expose lenis globally for component-specific scrolls (e.g. ReservationWizard or FloatingCTA)
    (window as any).lenisInstance = lenis;

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      delete (window as any).lenisInstance;
    };
  }, []);

  return null;
}
