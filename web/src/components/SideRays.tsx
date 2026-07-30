"use client";

import React, { useEffect, useRef } from 'react';

interface SideRaysProps {
  rayColor?: string;
  secondaryColor?: string;
  speed?: number;
  rayCount?: number;
  opacity?: number;
  className?: string;
}

export default function SideRays({
  rayColor = 'rgba(56, 189, 248, 0.18)', // Cyan-400 subtle glow
  secondaryColor = 'rgba(37, 99, 235, 0.12)', // Blue-600 subtle glow
  speed = 0.5,
  rayCount = 12,
  opacity = 0.6,
  className = '',
}: SideRaysProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Ray data structures for left and right rays
    const rays: Array<{
      side: 'left' | 'right';
      y: number;
      length: number;
      angle: number;
      width: number;
      speed: number;
      alpha: number;
      maxAlpha: number;
    }> = [];

    for (let i = 0; i < rayCount; i++) {
      const side = i % 2 === 0 ? 'left' : 'right';
      rays.push({
        side,
        y: Math.random() * height,
        length: Math.random() * (width * 0.45) + width * 0.25,
        angle: (Math.random() - 0.5) * 0.3,
        width: Math.random() * 60 + 20,
        speed: (Math.random() * 0.002 + 0.001) * speed,
        alpha: Math.random() * 0.5,
        maxAlpha: Math.random() * 0.4 + 0.2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01 * speed;
      ctx.clearRect(0, 0, width, height);

      rays.forEach((ray) => {
        const startX = ray.side === 'left' ? 0 : width;
        const targetX = ray.side === 'left' ? ray.length : width - ray.length;
        const endY = ray.y + Math.sin(time + ray.y) * 40;

        const gradient = ctx.createLinearGradient(startX, ray.y, targetX, endY);
        const color = ray.side === 'left' ? rayColor : secondaryColor;

        gradient.addColorStop(0, color);
        gradient.addColorStop(0.7, color.replace(/[\d\.]+\)$/, `${(ray.maxAlpha * 0.4).toFixed(2)})`));
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = opacity * (0.5 + Math.sin(time + ray.y) * 0.3);

        ctx.moveTo(startX, ray.y - ray.width / 2);
        ctx.lineTo(targetX, endY - ray.width * 1.5);
        ctx.lineTo(targetX, endY + ray.width * 1.5);
        ctx.lineTo(startX, ray.y + ray.width / 2);

        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [rayColor, secondaryColor, speed, rayCount, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none -z-10 ${className}`}
      style={{ opacity }}
    />
  );
}
