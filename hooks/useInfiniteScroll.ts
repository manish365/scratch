import { useLayoutEffect } from "react";

export default function useInfiniteScroll(
  {
    trackElement = "", // Element placed at bottom of scroll container
    containerElement = "#app-main", // Scroll container, window used if not provided
    currentPage = 1
  },
  callback: any = null
) {
  useLayoutEffect(() => {
    // Element whose position we want to track
    const ele = document.querySelector(trackElement);
    const singlePageHeight = 170;
    let lastFetchTimeStamp = Date.now();

    // If not containerElement provided, we use window
    let container: any = window;
    if (containerElement) {
      container = document.querySelector(containerElement);
    }

    // console.log("[infinite scroll]", ele, container);

    // Get window innerHeight or height of container (if provided)
    let h: any;
    if (containerElement) {
      h = container?.getBoundingClientRect()?.height;
    } else {
      h = container.innerHeight;
    }

    if (currentPage < 1) {
      currentPage = 1;
    }
    // console.log("[infinite scroll] height", h);

    const handleScroll = () => {
      const elePos = ele?.getBoundingClientRect()?.y || 1000;
      // console.log("[infinite scroll] is callback()", elePos, h, currentPage);
      // console.log(
      //   "[infinite scroll]",
      //   elePos + (singlePageHeight * (currentPage-1)),
      //   "<=",
      //   h
      // );
      if ((elePos + (singlePageHeight * (currentPage-1))) <= h) {
        if (typeof callback === "function") {
          const currentTimeStamp = Date.now();
          const diff = currentTimeStamp - lastFetchTimeStamp;
          if (diff > 1000) {
            lastFetchTimeStamp = Date.now();
            console.log("===========> calling!!", lastFetchTimeStamp, Date.now(), diff);
            debounce(callback(), 1000);
          } else {
            // console.log("-----------> skipped!! ", diff);
          }
        }
      }
    };

    const debounce = (fn: Function, ms = 300) => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
      };
    };

    // Set a passive scroll listener on our container
    container?.addEventListener("scroll", handleScroll, { passive: true });

    // handle cleanup by removing scroll listener
    return () =>
      container?.removeEventListener("scroll", handleScroll, { passive: true });
  });
}
