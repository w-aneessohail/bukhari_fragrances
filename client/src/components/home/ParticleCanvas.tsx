import { useEffect, useRef } from "react";

type ParticleCanvasProps = {
  count?: number;
};

export default function ParticleCanvas({ count = 50 }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationId = 0;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.4 + 0.15,
      opacity: Math.random() * 0.5 + 0.2
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (const particle of particles) {
        particle.y -= particle.speed;
        if (particle.y < -8) {
          particle.y = canvas.height + 8;
          particle.x = Math.random() * canvas.width;
        }

        context.beginPath();
        context.fillStyle = `rgba(184, 134, 11, ${particle.opacity})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      animationId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 opacity-60" aria-hidden />;
}
