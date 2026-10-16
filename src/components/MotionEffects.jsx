import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ITEM_SELECTOR = [
  "[data-motion-item]",
  ".article-card",
  ".articles-card",
  ".author-tile",
  ".category-card",
  ".work-card",
  ".work-detail__cards > div",
  ".work-detail__fact",
  ".case-evidence",
  ".work-hero__content",
  ".work-hero__note",
  ".work-index__heading",
  ".work-index__jump",
  ".work-cta__panel",
].join(", ");

const TARGET_SELECTOR = ITEM_SELECTOR;

const MAX_STAGGER_INDEX = 6;

const getStaggerIndex = (element) => {
  if (!element.matches(ITEM_SELECTOR) || !element.parentElement) return 0;

  const siblings = Array.from(element.parentElement.children).filter((sibling) =>
    sibling.matches(ITEM_SELECTOR)
  );

  return Math.min(Math.max(siblings.indexOf(element), 0), MAX_STAGGER_INDEX);
};

const isInInitialViewport = (element) => {
  const bounds = element.getBoundingClientRect();

  return bounds.bottom > 0 && bounds.top < window.innerHeight * 0.88;
};

const MotionEffects = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.getElementById("main-content");

    if (!root || typeof window.IntersectionObserver !== "function") {
      return undefined;
    }

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const trackedElements = new Set();
    let intersectionObserver;
    let mutationObserver;
    let routeTimer;
    let isActive = false;

    const revealAndReset = () => {
      trackedElements.forEach((element) => {
        intersectionObserver?.unobserve(element);
        element.classList.remove(
          "motion-reveal",
          "motion-reveal--item",
          "motion-reveal--section",
          "motion-reveal--visible"
        );
        element.style.removeProperty("--motion-order");
      });
      trackedElements.clear();
    };

    const registerElement = (element) => {
      if (
        trackedElements.has(element) ||
        element.closest("[data-motion='off']")
      ) {
        return;
      }

      const isItem = element.matches(ITEM_SELECTOR);
      const staggerIndex = getStaggerIndex(element);

      trackedElements.add(element);
      element.style.setProperty("--motion-order", String(staggerIndex));
      element.classList.add(
        "motion-reveal",
        isItem ? "motion-reveal--item" : "motion-reveal--section"
      );

      if (isInInitialViewport(element)) {
        element.classList.add("motion-reveal--visible");
        return;
      }

      intersectionObserver.observe(element);
    };

    const registerTree = (node) => {
      if (!(node instanceof Element)) return;

      if (node.matches(TARGET_SELECTOR)) registerElement(node);
      node.querySelectorAll(TARGET_SELECTOR).forEach(registerElement);
    };

    const stopObservers = () => {
      intersectionObserver?.disconnect();
      mutationObserver?.disconnect();
      intersectionObserver = undefined;
      mutationObserver = undefined;
      isActive = false;
    };

    const disableMotion = () => {
      stopObservers();
      root.classList.remove("motion-route-enter");
      window.clearTimeout(routeTimer);
      revealAndReset();
    };

    const enableMotion = () => {
      if (isActive || reducedMotion?.matches) return;

      isActive = true;
      root.classList.remove("motion-route-enter");
      // Force a style boundary so route entrance restarts on navigation.
      void root.offsetWidth;
      root.classList.add("motion-route-enter");
      routeTimer = window.setTimeout(() => {
        root.classList.remove("motion-route-enter");
      }, 720);

      intersectionObserver = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("motion-reveal--visible");
            intersectionObserver?.unobserve(entry.target);
          });
        },
        {
          rootMargin: "0px 0px -10% 0px",
          threshold: 0.08,
        }
      );

      registerTree(root);

      if (typeof window.MutationObserver === "function") {
        mutationObserver = new window.MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach(registerTree);
          });
        });
        mutationObserver.observe(root, { childList: true, subtree: true });
      }
    };

    const handleMotionPreference = (event) => {
      if (event.matches) {
        disableMotion();
      } else {
        enableMotion();
      }
    };

    enableMotion();

    if (typeof reducedMotion?.addEventListener === "function") {
      reducedMotion.addEventListener("change", handleMotionPreference);
    } else {
      reducedMotion?.addListener?.(handleMotionPreference);
    }

    return () => {
      if (typeof reducedMotion?.removeEventListener === "function") {
        reducedMotion.removeEventListener("change", handleMotionPreference);
      } else {
        reducedMotion?.removeListener?.(handleMotionPreference);
      }

      stopObservers();
      window.clearTimeout(routeTimer);
      root.classList.remove("motion-route-enter");
      revealAndReset();
    };
  }, [pathname]);

  return null;
};

export default MotionEffects;
