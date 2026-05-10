import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

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

    // Fewer nodes, much more subtle
    const nodeCount = mobile
      ? Math.min(15, Math.floor((w() * h()) / 40000))
      : Math.min(40, Math.floor((w() * h()) / 22000));

    // Slower drift for premium feel
    const speed = mobile ? 0.12 : 0.18;

    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: 1 + Math.random() * 0.8,
    }));

    const connectionDist = mobile ? 130 : 170;
    const frameSkip = mobile ? 2 : 1;

    const draw = () => {
      frameCount.current++;
      const width = w();
      const height = h();
      const nodes = nodesRef.current;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));
      }

      if (frameCount.current % frameSkip === 0) {
        ctx.clearRect(0, 0, width, height);

        // Subtle monochrome lines — single soft color
        ctx.lineWidth = 0.5;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distSq = dx * dx + dy * dy;
            if (distSq < connectionDist * connectionDist) {
              const dist = Math.sqrt(distSq);
              const alpha = (1 - dist / connectionDist) * 0.12;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
              ctx.stroke();
            }
          }
        }

        // Simple, small, low-opacity dots — no glow, no pulse
        ctx.fillStyle = 'rgba(203, 213, 225, 0.35)';
        for (const n of nodes) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
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
      aria-hidden="true"
    />
  );
};
