'use client';

import React, { useEffect, useRef } from 'react';

export const AuraGlowBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Attempt UnicornStudio initialization if available
    if (typeof window !== 'undefined') {
      try {
        if ((window as any).UnicornStudio) {
          (window as any).UnicornStudio.init?.();
        } else {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js';
          script.async = true;
          script.onload = () => {
            (window as any).UnicornStudio?.init?.();
          };
          document.body.appendChild(script);
        }
      } catch (e) {
        // Fallback safely to canvas
      }
    }

    // High performance interactive canvas fluid glow
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = 1050);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = 1050;
    };
    window.addEventListener('resize', handleResize);

    let mouseX = width / 2;
    let mouseY = 300;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let t = 0;

    // Fluid glow waves matching limited.aura.build
    const render = () => {
      t += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Base Dark Horizon
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // 2. Central Luminescent Amber/Gold Core
      const amberX = width * 0.5 + Math.sin(t * 0.8) * 60 + (mouseX - width / 2) * 0.08;
      const amberY = 220 + Math.cos(t * 0.6) * 40 + (mouseY - 200) * 0.08;
      const amberGrad = ctx.createRadialGradient(amberX, amberY, 0, amberX, amberY, 550);
      amberGrad.addColorStop(0, 'rgba(245, 158, 11, 0.42)');
      amberGrad.addColorStop(0.3, 'rgba(234, 88, 12, 0.28)');
      amberGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.16)');
      amberGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = amberGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Emerald Green Fluid Nebula (Left Wing)
      const greenX = width * 0.28 + Math.cos(t * 0.7) * 80;
      const greenY = 320 + Math.sin(t * 0.9) * 50;
      const greenGrad = ctx.createRadialGradient(greenX, greenY, 0, greenX, greenY, 480);
      greenGrad.addColorStop(0, 'rgba(16, 185, 129, 0.38)');
      greenGrad.addColorStop(0.4, 'rgba(5, 150, 105, 0.22)');
      greenGrad.addColorStop(0.8, 'rgba(6, 182, 212, 0.12)');
      greenGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = greenGrad;
      ctx.fillRect(0, 0, width, height);

      // 4. Cyan / Sky Blue Fluid Ribbon (Right Wing)
      const cyanX = width * 0.72 + Math.sin(t * 0.85) * 80;
      const cyanY = 280 + Math.cos(t * 0.75) * 60;
      const cyanGrad = ctx.createRadialGradient(cyanX, cyanY, 0, cyanX, cyanY, 520);
      cyanGrad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
      cyanGrad.addColorStop(0.35, 'rgba(59, 130, 246, 0.25)');
      cyanGrad.addColorStop(0.7, 'rgba(147, 51, 234, 0.15)');
      cyanGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = cyanGrad;
      ctx.fillRect(0, 0, width, height);

      // 5. Deep Purple / Violet Under-Glow
      const purpleX = width * 0.5 + Math.cos(t * 0.5) * 100;
      const purpleY = 480 + Math.sin(t * 0.6) * 50;
      const purpleGrad = ctx.createRadialGradient(purpleX, purpleY, 0, purpleX, purpleY, 600);
      purpleGrad.addColorStop(0, 'rgba(147, 51, 234, 0.28)');
      purpleGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.14)');
      purpleGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = purpleGrad;
      ctx.fillRect(0, 0, width, height);

      // 6. Smooth undulating wave ribbons across the header
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const yBase = 320 + i * 60;
        ctx.moveTo(0, yBase);
        for (let x = 0; x <= width; x += 30) {
          const wave =
            Math.sin(x * 0.003 + t * 1.2 + i * 1.5) * 45 +
            Math.cos(x * 0.006 - t * 0.8) * 30;
          ctx.lineTo(x, yBase + wave);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const waveGrad = ctx.createLinearGradient(0, yBase - 50, width, yBase + 100);
        if (i === 0) {
          waveGrad.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
          waveGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.18)');
          waveGrad.addColorStop(1, 'rgba(6, 182, 212, 0.15)');
        } else if (i === 1) {
          waveGrad.addColorStop(0, 'rgba(6, 182, 212, 0.16)');
          waveGrad.addColorStop(0.5, 'rgba(147, 51, 234, 0.15)');
          waveGrad.addColorStop(1, 'rgba(234, 88, 12, 0.12)');
        } else {
          waveGrad.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
          waveGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.14)');
          waveGrad.addColorStop(1, 'rgba(99, 102, 241, 0.1)');
        }
        ctx.fillStyle = waveGrad;
        ctx.fill();
      }
      ctx.restore();

      // 7. Gradient Fadeout towards bottom of hero
      const fadeGrad = ctx.createLinearGradient(0, height - 300, 0, height);
      fadeGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      fadeGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = fadeGrad;
      ctx.fillRect(0, height - 300, width, 300);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 h-[1050px] pointer-events-none z-0 overflow-hidden">
      {/* UnicornStudio WebGL project container (if active in browser) */}
      <div className="aura-background-component absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div data-us-project="vTTCp5g4cVl9nwjlT56Z" className="absolute w-full h-full left-0 top-0"></div>
      </div>

      {/* Hardware-accelerated Interactive 60fps Fluid Canvas Glow */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-90 mix-blend-screen"
      />

      {/* Atmospheric ambient radial blur backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[750px] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(245,158,11,0.28),rgba(16,185,129,0.18)_35%,rgba(6,182,212,0.14)_55%,transparent_80%)] blur-3xl pointer-events-none z-0"></div>
    </div>
  );
};
