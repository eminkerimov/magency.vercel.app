import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";

const Arrow = ({ previous = false }) => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d={previous ? "M20 12H4m6-6-6 6 6 6" : "M4 12h16m-6-6 6 6-6 6"} /></svg>;

const StudioGallery = ({ images = [] }) => {
  const id = useId();
  const railRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const photoRef = useRef(null);
  const triggerRef = useRef(null);
  const thumbsRef = useRef([]);
  const dragRef = useRef(null);
  const transitionRef = useRef(false);
  const animationRef = useRef(null);
  const namedNodesRef = useRef(new Set());
  const mountedRef = useRef(true);
  const timerRef = useRef(null);
  const [position, setPosition] = useState({ index: 0, start: true, end: false });
  const [active, setActive] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const isOpen = active !== null;
  const image = isOpen ? images[active] : null;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      animationRef.current?.skipTransition();
      namedNodesRef.current.forEach((node) => { node.style.viewTransitionName = ""; });
      namedNodesRef.current.clear();
      transitionRef.current = false;
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const end = rail.scrollWidth - rail.clientWidth - rail.scrollLeft < 3;
    let index = 0;
    let distance = Infinity;
    Array.from(rail.children).forEach((child, nextIndex) => {
      const nextDistance = Math.abs(child.offsetLeft - rail.scrollLeft);
      if (nextDistance < distance) { index = nextIndex; distance = nextDistance; }
    });
    setPosition({ index: end ? Math.max(0, images.length - 1) : index, start: rail.scrollLeft < 3, end });
  }, [images.length]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    return () => { observer.disconnect(); window.clearTimeout(timerRef.current); };
  }, [measure]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const overflow = document.body.style.overflow;
    const padding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${(parseFloat(getComputedStyle(document.body).paddingRight) || 0) + scrollbar}px`;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = padding;
      if (triggerRef.current?.isConnected) triggerRef.current.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const transition = useCallback((from, change, target) => {
    if (transitionRef.current || reducedMotion || !document.startViewTransition || document.hidden) { change(); return; }
    transitionRef.current = true;
    let destination;
    if (from) { from.style.viewTransitionName = "studio-journal-photo"; namedNodesRef.current.add(from); }
    try {
      const animation = document.startViewTransition(() => {
        if (from) from.style.viewTransitionName = "";
        if (!mountedRef.current) return;
        flushSync(change);
        destination = target();
        if (destination) { destination.style.viewTransitionName = "studio-journal-photo"; namedNodesRef.current.add(destination); }
      });
      animationRef.current = animation;
      animation.finished.catch(() => {}).finally(() => {
        if (from) from.style.viewTransitionName = "";
        if (destination) destination.style.viewTransitionName = "";
        namedNodesRef.current.delete(from);
        namedNodesRef.current.delete(destination);
        if (animationRef.current === animation) animationRef.current = null;
        transitionRef.current = false;
      });
    } catch {
      if (from) from.style.viewTransitionName = "";
      transitionRef.current = false;
      change();
    }
  }, [reducedMotion]);

  const openPhoto = (index, trigger) => {
    if (transitionRef.current) return;
    triggerRef.current = trigger;
    transition(thumbsRef.current[index], () => setActive(index), () => photoRef.current);
  };
  const closePhoto = () => {
    if (active === null) return;
    if (transitionRef.current) {
      animationRef.current?.skipTransition();
      namedNodesRef.current.forEach((node) => { node.style.viewTransitionName = ""; });
      namedNodesRef.current.clear();
      transitionRef.current = false;
      setActive(null);
      return;
    }
    const index = active;
    transition(photoRef.current, () => setActive(null), () => thumbsRef.current[index]);
  };
  const changePhoto = (direction) => {
    if (!transitionRef.current) setActive((current) => current === null ? null : (current + direction + images.length) % images.length);
  };
  const scrollToPhoto = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    const offsets = Array.from(rail.children, (card) => card.offsetLeft);
    const target = direction > 0
      ? offsets.find((offset) => offset > rail.scrollLeft + 4) ?? rail.scrollWidth
      : offsets.reverse().find((offset) => offset < rail.scrollLeft - 4) ?? 0;
    rail.scrollTo({ left: target, behavior: reducedMotion ? "instant" : "smooth" });
  };
  const pointerDown = (event) => {
    if (event.pointerType === "touch" || event.button !== 0) return;
    window.clearTimeout(timerRef.current);
    dragRef.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false, pointerId: event.pointerId };
  };
  const pointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.buttons !== 1) { dragRef.current = null; setDragging(false); return; }
    const delta = event.clientX - drag.x;
    if (!drag.moved && Math.abs(delta) < 6) return;
    if (!drag.moved) { drag.moved = true; event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); }
    event.preventDefault();
    event.currentTarget.scrollLeft = drag.left - delta;
  };
  const finishDrag = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
    timerRef.current = window.setTimeout(() => { dragRef.current = null; }, 0);
  };
  const dialogKey = (event) => {
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); closePhoto(); return; }
    if (event.key === "ArrowRight") { event.preventDefault(); changePhoto(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); changePhoto(-1); }
    if (event.key !== "Tab") return;
    const elements = Array.from(dialogRef.current.querySelectorAll("button:not([disabled]), a[href]"));
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };
  const railKey = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowRight") { event.preventDefault(); scrollToPhoto(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); scrollToPhoto(-1); }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const rail = railRef.current;
      rail.scrollTo({ left: event.key === "Home" ? 0 : rail.scrollWidth, behavior: reducedMotion ? "instant" : "smooth" });
    }
  };

  if (!images.length) return null;
  return <div className="studio-gallery">
    <div className="studio-gallery__toolbar">
      <span className="studio-gallery__hint"><i aria-hidden="true" />Drag to discover. Click to look closer.</span>
      <div className="studio-gallery__controls" aria-label="Visual journal controls">
        <button type="button" className="studio-gallery__arrow" aria-label="Previous photograph" aria-controls={id} disabled={position.start} onClick={() => scrollToPhoto(-1)}><Arrow previous /></button>
        <button type="button" className="studio-gallery__arrow" aria-label="Next photograph" aria-controls={id} disabled={position.end} onClick={() => scrollToPhoto(1)}><Arrow /></button>
      </div>
    </div>
    <div ref={railRef} id={id} className={`studio-gallery__rail${dragging ? " is-dragging" : ""}`} role="region" tabIndex={0} aria-label="Studio visual journal photographs. Use arrow keys to explore, Home or End to jump." onKeyDown={railKey} onScroll={measure} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={finishDrag} onPointerCancel={() => { window.clearTimeout(timerRef.current); dragRef.current = null; setDragging(false); }} onLostPointerCapture={finishDrag} onClickCapture={(event) => { if (dragRef.current?.moved) { event.preventDefault(); event.stopPropagation(); } }}>
      {images.map((photo, index) => <figure className="studio-gallery__item" key={photo.src}>
        <button type="button" className="studio-gallery__frame" onClick={(event) => openPhoto(index, event.currentTarget)} aria-label={`View ${photo.title || photo.alt} full screen`} aria-haspopup="dialog" draggable="false">
          <img ref={(element) => { thumbsRef.current[index] = element; }} src={photo.src} alt={photo.alt} loading="lazy" decoding="async" draggable="false" />
          <span className="studio-gallery__shade" aria-hidden="true" />
          <span className="studio-gallery__expand" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4M4 4l5 5m11-5-5 5M4 20l5-5m11 5-5-5" /></svg></span>
          <span className="studio-gallery__photo-label" aria-hidden="true">A closer look <Arrow /></span>
        </button>
        <figcaption><span>{photo.title}</span><small>{photo.caption}</small></figcaption>
      </figure>)}
    </div>
    <div className="studio-gallery__footer">
      <div className="studio-gallery__progress" aria-hidden="true"><span style={{ width: `${100 / images.length}%`, transform: `translateX(${position.index * 100}%)` }} /></div>
      <span className="studio-gallery__count" aria-live="polite" aria-atomic="true">{String(position.index + 1).padStart(2, "0")}<span> / {String(images.length).padStart(2, "0")}</span></span>
    </div>
    {createPortal(<dialog ref={dialogRef} className="studio-lightbox" aria-labelledby={`${id}-title`} aria-describedby={`${id}-caption`} onKeyDown={dialogKey} onCancel={(event) => { event.preventDefault(); closePhoto(); }} onClick={(event) => { if (event.target === event.currentTarget) closePhoto(); }}>
      {image && <div className="studio-lightbox__shell">
        <div className="studio-lightbox__topbar"><span>Visual journal <i aria-hidden="true">/</i> {String(active + 1).padStart(2, "0")} of {String(images.length).padStart(2, "0")}</span><button ref={closeRef} type="button" className="studio-lightbox__close" aria-label="Close photograph" onClick={closePhoto}><span>Close</span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button></div>
        <div className="studio-lightbox__stage">
          <button type="button" className="studio-lightbox__arrow studio-lightbox__arrow--previous" aria-label="Previous photograph" onClick={() => changePhoto(-1)} disabled={images.length < 2}><Arrow previous /></button>
          <img ref={photoRef} src={image.src} alt={image.alt} decoding="async" />
          <button type="button" className="studio-lightbox__arrow studio-lightbox__arrow--next" aria-label="Next photograph" onClick={() => changePhoto(1)} disabled={images.length < 2}><Arrow /></button>
        </div>
        <div className="studio-lightbox__caption"><div><h3 id={`${id}-title`}>{image.title || "A new perspective"}</h3><p id={`${id}-caption`}>{image.caption || image.alt}</p></div>{(image.photographer || image.credit) && (image.source ? <a href={image.source} target="_blank" rel="noreferrer">{image.credit || `Photography by ${image.photographer}`}<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" /></svg></a> : <span>{image.credit || `Photography by ${image.photographer}`}</span>)}</div>
      </div>}
    </dialog>, document.body)}
  </div>;
};

export default StudioGallery;
