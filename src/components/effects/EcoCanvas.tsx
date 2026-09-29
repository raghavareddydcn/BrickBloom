import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  pulseSpeed: number;
}

export default function EcoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Particle colors representing natural coir fibers & fresh green flora
    const colors = [
      'rgba(22, 163, 74, ',   // emerald green
      'rgba(34, 197, 94, ',   // bright green
      'rgba(200, 146, 66, ',  // golden coir
      'rgba(232, 150, 32, ',  // warm amber coir
    ];

    const particleCount = Math.min(38, Math.floor(window.innerWidth / 40));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -0.2 - Math.random() * 0.4, // gently floating upwards
        size: Math.random() * 2.2 + 1.2,
        alpha: Math.random() * 0.45 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: 0.015 + Math.random() * 0.02,
      });
    }

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Render subtle glowing background ambient blobs
      const grad1 = ctx.createRadialGradient(
        width * 0.2 + Math.sin(tick * 0.005) * 60,
        height * 0.35 + Math.cos(tick * 0.005) * 60,
        0,
        width * 0.2,
        height * 0.35,
        width * 0.45
      );
      grad1.addColorStop(0, 'rgba(22, 101, 52, 0.035)');
      grad1.addColorStop(1, 'rgba(22, 101, 52, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.85 + Math.cos(tick * 0.006) * 50,
        height * 0.7 + Math.sin(tick * 0.006) * 50,
        0,
        width * 0.85,
        height * 0.7,
        width * 0.4
      );
      grad2.addColorStop(0, 'rgba(200, 146, 66, 0.025)');
      grad2.addColorStop(1, 'rgba(200, 146, 66, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Render organic particles
      for (const p of particles) {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Subtle pulsing opacity
        const currentAlpha = p.alpha + Math.sin(tick * p.pulseSpeed) * 0.12;

        // Mouse interaction: gentle repulsion
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 0) {
            const force = (140 - dist) / 140;
            p.x += (dx / dist) * force * 1.8;
            p.y += (dy / dist) * force * 1.8;
          }
        }

        // Screen wrap
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0.05, Math.min(0.7, currentAlpha))})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70"
    />
  );
}
