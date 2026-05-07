import { useEffect, useRef } from 'react';

export default function RainOverlay({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const drops = [];
    const maxDrops = 150; // Adjust for density

    for (let i = 0; i < maxDrops; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 10 + 15,
        opacity: Math.random() * 0.2 + 0.1,
      });
    }

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw rain
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      
      for (let i = 0; i < maxDrops; i++) {
        const drop = drops[i];
        
        ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.length * 0.2, drop.y + drop.length); // slight angle
        ctx.stroke();

        drop.y += drop.speed;
        drop.x -= drop.speed * 0.2; // drift left slightly

        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5, // Behind whiteboard (10+), above background (0)
        opacity: 0.6,
      }}
    />
  );
}
