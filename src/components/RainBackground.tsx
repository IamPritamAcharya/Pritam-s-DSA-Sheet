import { useEffect, useRef } from 'react';

interface Drop {
  x: number;
  y: number;
  len: number;
  speed: number;
  opacity: number;
  width: number;
}

export function RainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ─── Generate drops ───
    const DROP_COUNT = 80;
    const drops: Drop[] = Array.from({ length: DROP_COUNT }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight,
      len:     12 + Math.random() * 28,    // 12–40px length
      speed:   0.4 + Math.random() * 0.8,  // slow gentle fall
      opacity: 0.018 + Math.random() * 0.028, // very subtle
      width:   0.6 + Math.random() * 0.6,
    }));

    let rafId: number;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drops.forEach(d => {
        // Draw the drop as a short vertical line with gradient fade
        const grad = ctx.createLinearGradient(d.x, d.y, d.x, d.y + d.len);
        grad.addColorStop(0, `rgba(180,170,255,0)`);
        grad.addColorStop(0.5, `rgba(180,170,255,${d.opacity})`);
        grad.addColorStop(1, `rgba(140,220,255,${d.opacity * 0.5})`);

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.len);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = d.width;
        ctx.stroke();

        // Fall
        d.y += d.speed;
        if (d.y > canvas.height + d.len) {
          d.y = -d.len;
          d.x = Math.random() * canvas.width;
        }
      });
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  );
}
