import { useEffect, useRef, useMemo } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  color: string;
}

const COLORS = {
  node1: '#6366F1',
  node2: '#8B5CF6',
  line: '#60A5FA',
  accent: '#F97316',
};

const isMobile = () => window.innerWidth < 768;

export const NeuralNetworkBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const frameCount = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mobile = isMobile();
    // Use lower DPR on mobile to reduce pixel count
    const dpr = mobile ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio;

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    // Fewer nodes on mobile, same density on desktop
    const nodeCount = mobile
      ? Math.min(25, Math.floor((w() * h()) / 25000))
      : Math.min(70, Math.floor((w() * h()) / 12000));

    const speed = mobile ? 0.25 : 0.4;

    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: mobile ? 1.2 + Math.random() * 1.5 : 1.5 + Math.random() * 2,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
      color: Math.random() > 0.85 ? COLORS.accent : Math.random() > 0.5 ? COLORS.node1 : COLORS.node2,
    }));

    const connectionDist = mobile ? 120 : 150;
    // Skip frames on mobile: render every 2nd frame for ~30fps instead of 60fps
    const frameSkip = mobile ? 2 : 1;

    const draw = () => {
      frameCount.current++;

      const width = w();
      const height = h();
      const nodes = nodesRef.current;

      // Always update positions for smooth physics
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulsePhase += n.pulseSpeed;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));
      }

      // Only render every Nth frame on mobile
      if (frameCount.current % frameSkip === 0) {
        ctx.clearRect(0, 0, width, height);

        // Draw connections — on mobile skip glow, use simpler path batching
        ctx.lineWidth = 0.5;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distSq = dx * dx + dy * dy;
            if (distSq < connectionDist * connectionDist) {
              const dist = Math.sqrt(distSq);
              const alpha = (1 - dist / connectionDist) * 0.25;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
              ctx.stroke();
            }
          }
        }

        // Draw nodes
        for (const n of nodes) {
          const pulse = 0.5 + 0.5 * Math.sin(n.pulsePhase);
          const r = n.radius * (1 + pulse * 0.3);

          // Skip glow effect on mobile for performance
          if (!mobile) {
            const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
            grad.addColorStop(0, n.color + '60');
            grad.addColorStop(1, n.color + '00');
            ctx.beginPath();
            ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          }

          // Core dot
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
};