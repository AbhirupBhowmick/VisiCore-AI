"use client";

import React from 'react';
import Link from 'next/link';
import { Video } from 'lucide-react';

interface LogoProps {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function Logo({
  href = '/',
  size = 'md',
  className = '',
  onClick,
}: LogoProps) {
  const iconSizes = {
    sm: 'w-[18px] h-[18px]',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const boxSizes = {
    sm: 'w-6 h-6 rounded-md',
    md: 'w-7 h-7 rounded-md',
    lg: 'w-8 h-8 rounded-lg',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const badgeSizes = {
    sm: 'text-[9px] px-1 py-0.25',
    md: 'text-[10px] px-1.5 py-0.5',
    lg: 'text-[11px] px-2 py-0.5',
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none leading-none ${className}`}>
      {/* Brand Icon Box */}
      <div className={`${boxSizes[size]} bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-sm`}>
        <Video className={iconSizes[size]} />
      </div>

      {/* Brand Text & Badge with shared visual baseline */}
      <div className="flex items-center gap-1.5 leading-none">
        <span className={`${textSizes[size]} font-bold text-white tracking-tight font-sans`}>
          VisiCore
        </span>
        <span className={`${badgeSizes[size]} font-mono font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded leading-none`}>
          AI
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        onClick={onClick}
        className="inline-flex items-center focus:outline-none cursor-pointer group"
      >
        {content}
      </Link>
    );
  }

  return content;
}
