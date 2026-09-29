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

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = 1100);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = 1100;
    };
    window.addEventListener('resize', handleResize);

    let mouseX = width / 2;
    let mouseY = 300;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Floating starlight particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    const render = () => {
      t += 0.012;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep obsidian void base
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // 1. Top Spotlight Luminescent Cone
      const spotlightX = width * 0.5;
      const spotlightGrad = ctx.createRadialGradient(spotlightX, 0, 0, spotlightX, 0, 900);
      spotlightGrad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
      spotlightGrad.addColorStop(0.3, 'rgba(16, 185, 129, 0.2)');
      spotlightGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.12)');
      spotlightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spotlightGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Primary Pulsing Amber / Gold Core Orb (centered behind title)
      const amberX = width * 0.5 + Math.sin(t * 0.7) * 70 + (mouseX - width / 2) * 0.06;
      const amberY = 240 + Math.cos(t * 0.6) * 45 + (mouseY - 200) * 0.06;
      const amberRadius = 520 + Math.sin(t * 1.5) * 40;
      const amberGrad = ctx.createRadialGradient(amberX, amberY, 0, amberX, amberY, amberRadius);
      amberGrad.addColorStop(0, 'rgba(245, 158, 11, 0.48)');
      amberGrad.addColorStop(0.25, 'rgba(234, 88, 12, 0.32)');
      amberGrad.addColorStop(0.55, 'rgba(16, 185, 129, 0.16)');
      amberGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = amberGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Electric Emerald Nebula (Left Wing)
      const greenX = width * 0.22 + Math.cos(t * 0.65) * 90;
      const greenY = 320 + Math.sin(t * 0.8) * 60;
      const greenGrad = ctx.createRadialGradient(greenX, greenY, 0, greenX, greenY, 520);
      greenGrad.addColorStop(0, 'rgba(16, 185, 129, 0.42)');
      greenGrad.addColorStop(0.35, 'rgba(5, 150, 105, 0.25)');
      greenGrad.addColorStop(0.7, 'rgba(6, 182, 212, 0.14)');
      greenGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = greenGrad;
      ctx.fillRect(0, 0, width, height);

      // 4. Electric Sky Blue / Cyan Ribbon (Right Wing)
      const cyanX = width * 0.78 + Math.sin(t * 0.8) * 90;
      const cyanY = 260 + Math.cos(t * 0.7) * 70;
      const cyanGrad = ctx.createRadialGradient(cyanX, cyanY, 0, cyanX, cyanY, 560);
      cyanGrad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
      cyanGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.28)');
      cyanGrad.addColorStop(0.7, 'rgba(147, 51, 234, 0.16)');
      cyanGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = cyanGrad;
      ctx.fillRect(0, 0, width, height);

      // 5. Deep Electric Violet Aurora Horizon
      const purpleX = width * 0.5 + Math.cos(t * 0.5) * 110;
      const purpleY = 460 + Math.sin(t * 0.6) * 55;
      const purpleGrad = ctx.createRadialGradient(purpleX, purpleY, 0, purpleX, purpleY, 650);
      purpleGrad.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
      purpleGrad.addColorStop(0.4, 'rgba(99, 102, 241, 0.2)');
      purpleGrad.addColorStop(0.8, 'rgba(15, 23, 42, 0)');
      purpleGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = purpleGrad;
      ctx.fillRect(0, 0, width, height);

      // 6. Fluid Undulating Wave Ribbons (Harmonic Screen Blend)
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const yBase = 280 + i * 75;
        ctx.moveTo(0, yBase);
        for (let x = 0; x <= width; x += 25) {
          const wave =
            Math.sin(x * 0.0028 + t * (1 + i * 0.2) + i * 1.6) * (40 + i * 8) +
            Math.cos(x * 0.0055 - t * 0.7) * (25 + i * 5);
          ctx.lineTo(x, yBase + wave);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const waveGrad = ctx.createLinearGradient(0, yBase - 60, width, yBase + 120);
        if (i === 0) {
          waveGrad.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
          waveGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.24)');
          waveGrad.addColorStop(1, 'rgba(6, 182, 212, 0.2)');
        } else if (i === 1) {
          waveGrad.addColorStop(0, 'rgba(6, 182, 212, 0.22)');
          waveGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.2)');
          waveGrad.addColorStop(1, 'rgba(245, 158, 11, 0.16)');
        } else if (i === 2) {
          waveGrad.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
          waveGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.2)');
          waveGrad.addColorStop(1, 'rgba(147, 51, 234, 0.15)');
        } else {
          waveGrad.addColorStop(0, 'rgba(147, 51, 234, 0.16)');
          waveGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.18)');
          waveGrad.addColorStop(1, 'rgba(245, 158, 11, 0.14)');
        }
        ctx.fillStyle = waveGrad;
        ctx.fill();
      }
      ctx.restore();

      // 7. Subtle Starlight Motes (Floating particles)
      ctx.save();
      for (const p of particles) {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.phase += p.pulseSpeed;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity.toFixed(3)})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      ctx.restore();

      // 8. Smooth Gradient Fade to Obsidian Base
      const fadeGrad = ctx.createLinearGradient(0, height - 350, 0, height);
      fadeGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      fadeGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.7)');
      fadeGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = fadeGrad;
      ctx.fillRect(0, height - 350, width, 350);

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
    <div className="absolute top-0 left-0 right-0 h-[1100px] pointer-events-none z-0 overflow-hidden select-none">
      {/* UnicornStudio WebGL project container from limited.aura.build */}
      <div className="aura-background-component absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div data-us-project="vTTCp5g4cVl9nwjlT56Z" className="absolute w-full h-full left-0 top-0"></div>
      </div>

      {/* Hardware-accelerated Interactive 60fps Fluid Canvas Glow */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-95 mix-blend-screen"
      />

      {/* Atmospheric multi-stop glowing bloom backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[850px] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(245,158,11,0.32),rgba(16,185,129,0.22)_35%,rgba(6,182,212,0.18)_55%,transparent_80%)] blur-3xl pointer-events-none z-0"></div>
    </div>
  );
};
