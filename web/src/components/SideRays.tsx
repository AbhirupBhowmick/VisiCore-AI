"use client";

import React, { useEffect, useRef, useState } from 'react';

interface SideRaysProps {
  rayColor?: string;
  secondaryColor?: string;
  speed?: number;
  rayCount?: number;
  opacity?: number;
  className?: string;
}

export default function SideRays({
  rayColor = 'rgba(56, 189, 248, 0.35)', // Vibrant cyan beam glow
  secondaryColor = 'rgba(37, 99, 235, 0.25)', // Deep blue-600 beam glow
  speed = 0.6,
  rayCount = 10,
  opacity = 0.7,
  className = '',
}: SideRaysProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    const updateSize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const getWidth = () => containerRef.current?.clientWidth || window.innerWidth;
    const getHeight = () => containerRef.current?.clientHeight || window.innerHeight;

    const width = getWidth();
    const height = getHeight();

    // Create rays projecting inwards from left and right sides
    const rays = Array.from({ length: rayCount }, (_, i) => {
      const side = i % 2 === 0 ? 'left' : 'right';
      return {
        side,
        y: (height / rayCount) * i + Math.random() * 40 - 20,
        length: width * (0.35 + Math.random() * 0.35),
        angle: (Math.random() - 0.5) * 0.2,
        width: Math.random() * 50 + 25,
        speed: (0.0015 + Math.random() * 0.002) * speed,
        phase: Math.random() * Math.PI * 2,
        maxAlpha: 0.35 + Math.random() * 0.35,
      };
    });

    let time = 0;

    const render = () => {
      const currentW = getWidth();
      const currentH = getHeight();
      
      time += 0.015 * speed;
      ctx.clearRect(0, 0, currentW, currentH);

      rays.forEach((ray) => {
        const startX = ray.side === 'left' ? 0 : currentW;
        const endX = ray.side === 'left' ? ray.length : currentW - ray.length;
        const endY = ray.y + Math.sin(time + ray.phase) * 35;

        const grad = ctx.createLinearGradient(startX, ray.y, endX, endY);
        const baseColor = ray.side === 'left' ? rayColor : secondaryColor;

        grad.addColorStop(0, baseColor);
        grad.addColorStop(0.6, baseColor.replace(/[\d\.]+\)$/, '0.12)'));
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.globalAlpha = opacity * (0.4 + 0.4 * Math.sin(time + ray.phase));

        ctx.moveTo(startX, ray.y - ray.width * 0.5);
        ctx.lineTo(endX, endY - ray.width * 1.2);
        ctx.lineTo(endX, endY + ray.width * 1.2);
        ctx.lineTo(startX, ray.y + ray.width * 0.5);

        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, rayColor, secondaryColor, speed, rayCount, opacity]);

  return (
    <div ref={containerRef} className={`absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden ${className}`}>
      {/* Ambient background glow cones on left & right */}
      <div className="absolute top-1/4 -left-20 w-[450px] h-[350px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-[450px] h-[350px] bg-blue-600/10 rounded-full blur-[110px] pointer-events-none"></div>
      
      {mounted && (
        <canvas
          ref={canvasRef}
          className="w-full h-full block pointer-events-none"
          style={{ opacity }}
        />
      )}
    </div>
  );
}
