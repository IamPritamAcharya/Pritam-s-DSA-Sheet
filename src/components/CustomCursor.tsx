import { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch after mount (accurate in browser)
    if (window.matchMedia('(hover: none)').matches || 'ontouchstart' in window) {
      setIsTouch(true);
      return;
    }

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let visible = false;
    let rafId: number;

    const show = () => {
      if (visible) return;
      visible = true;
      dot.classList.add('cursor-dot--visible');
      ring.classList.add('cursor-ring--visible');
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      show();
    };
    const onDown = () => {
      dot.classList.add('cursor-dot--click');
      ring.classList.add('cursor-ring--click');
    };
    const onUp = () => {
      dot.classList.remove('cursor-dot--click');
      ring.classList.remove('cursor-ring--click');
    };
    const onEnter = () => ring.classList.add('cursor-ring--hover');
    const onLeave = () => ring.classList.remove('cursor-ring--hover');

    const attachHover = () => {
      document.querySelectorAll<Element>(
        'a, button, [role="button"], .topic-group__header, .problem-card__check'
      ).forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });
    attachHover();

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      dot.style.transform  = `translate(${mx - 3}px, ${my - 3}px)`;
      rx = lerp(rx, mx, 0.13);
      ry = lerp(ry, my, 0.13);
      ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      observer.disconnect();
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
