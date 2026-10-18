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

const IMAGE_SELECTOR = "[data-motion-image]";
const TARGET_SELECTOR = `${ITEM_SELECTOR}, ${IMAGE_SELECTOR}`;

const MAX_STAGGER_INDEX = 6;

const getStaggerIndex = (element) => {
  if (!element.parentElement) return 0;

  const siblings = Array.from(element.parentElement.children).filter((sibling) =>
    sibling.matches(TARGET_SELECTOR)
  );

  return Math.min(Math.max(siblings.indexOf(element), 0), MAX_STAGGER_INDEX);
};

const isInViewport = (element) => {
  const bounds = element.getBoundingClientRect();

  return bounds.bottom > 0 && bounds.top < window.innerHeight;
};

const MotionEffects = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.getElementById("main-content");

    if (!root || typeof window.IntersectionObserver !== "function") {
      return undefined;
    }

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const trackedElements = new Map();
    const pendingReveals = new Set();
    let intersectionObserver;
    let mutationObserver;
    let routeTimer;
    let revealFrame;
    let isActive = false;

    const revealAndReset = () => {
      trackedElements.forEach((record, element) => {
        record.cancelImageWait?.();
        intersectionObserver?.unobserve(element);
        element.classList.remove(
          "motion-reveal",
          "motion-reveal--item",
          "motion-reveal--visible",
          "motion-image-reveal",
          "motion-image-reveal--visible"
        );
        element.style.removeProperty("--motion-order");
      });
      trackedElements.clear();
      pendingReveals.clear();
      window.cancelAnimationFrame(revealFrame);
      revealFrame = undefined;
    };

    const queueReveal = (element) => {
      if (!isActive || !trackedElements.has(element)) return;

      pendingReveals.add(element);
      if (revealFrame) return;

      // Two frames establish the masked state even for the first visible image.
      revealFrame = window.requestAnimationFrame(() => {
        revealFrame = window.requestAnimationFrame(() => {
          revealFrame = undefined;
          pendingReveals.forEach((target) => {
            const record = trackedElements.get(target);
            if (!record) return;

            target.classList.add(
              record.isImage
                ? "motion-image-reveal--visible"
                : "motion-reveal--visible"
            );
          });
          pendingReveals.clear();
        });
      });
    };

    const revealElement = (element) => {
      const record = trackedElements.get(element);
      if (!record || record.revealing) return;

      record.revealing = true;
      intersectionObserver?.unobserve(element);

      const image = record.isImage
        ? element.matches("img")
          ? element
          : element.querySelector("img")
        : null;

      if (!image || image.complete) {
        queueReveal(element);
        return;
      }

      // Lazy photos should reveal the photo, not an empty loading surface.
      // The timeout also guarantees broken or stalled images cannot hide UI.
      let loadTimer;
      const finish = () => {
        record.cancelImageWait?.();
        record.cancelImageWait = undefined;
        queueReveal(element);
      };

      record.cancelImageWait = () => {
        image.removeEventListener("load", finish);
        image.removeEventListener("error", finish);
        window.clearTimeout(loadTimer);
      };
      image.addEventListener("load", finish, { once: true });
      image.addEventListener("error", finish, { once: true });
      loadTimer = window.setTimeout(finish, 1600);
    };

    const registerElement = (element) => {
      if (
        trackedElements.has(element) ||
        element.closest("[data-motion='off']")
      ) {
        return;
      }

      const isImage = element.matches(IMAGE_SELECTOR);
      const staggerIndex = getStaggerIndex(element);

      trackedElements.set(element, { isImage, revealing: false });
      element.style.setProperty("--motion-order", String(staggerIndex));
      if (isImage) {
        element.classList.add("motion-image-reveal");
      } else {
        element.classList.add("motion-reveal", "motion-reveal--item");
      }

      if (isInViewport(element)) {
        revealElement(element);
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
      }, 420);

      intersectionObserver = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            revealElement(entry.target);
          });
        },
        {
          // No negative margin: the final image must reveal at the page bottom.
          rootMargin: "0px",
          threshold: 0,
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
