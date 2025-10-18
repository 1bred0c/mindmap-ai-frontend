'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'default' | 'compact';
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Logo Component with Neon Effect
 * Clickable logo that navigates to homepage
 */
export function Logo({ 
  variant = 'default', 
  className,
  showText = true,
  size = 'md'
}: LogoProps) {
  const sizeClasses = {
    sm: { logo: 'w-8 h-8', text: 'text-lg' },
    md: { logo: 'w-10 h-10', text: 'text-2xl' },
    lg: { logo: 'w-12 h-12', text: 'text-3xl' },
  };

  return (
    <Link 
      href="/" 
      className={cn(
        'flex items-center gap-3 group transition-all duration-300',
        'hover:scale-105',
        className
      )}
    >
      {/* Logo Image with Neon Glow */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-purple-500/50 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Logo */}
        <div className={cn(
          'relative rounded-lg overflow-hidden',
          'ring-2 ring-transparent group-hover:ring-purple-500/50',
          'shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]',
          'transition-all duration-300',
          sizeClasses[size].logo
        )}>
          <Image
            src="/logo.png"
            alt="MindMap Pro Logo"
            width={48}
            height={48}
            className={cn(
              'object-contain',
              'filter brightness-110 contrast-110',
              'group-hover:brightness-125',
              'transition-all duration-300',
              sizeClasses[size].logo
            )}
            priority
          />
        </div>
      </div>

      {/* Text */}
      {showText && (
        <div className={cn(
          'font-bold font-display',
          sizeClasses[size].text
        )}>
          {variant === 'compact' ? (
            <span className="text-glow-purple">MMP</span>
          ) : (
            <>
              <span className="text-glow-purple">MindMap</span>
              <span className="text-cyan-400"> Pro</span>
            </>
          )}
        </div>
      )}
    </Link>
  );
}

/**
 * Logo Only - Just the image with neon effect
 */
export function LogoIcon({ 
  size = 'md',
  className 
}: { 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <Link href="/" className={cn('group block', className)}>
      <div className="relative">
        {/* Neon glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-cyan-500/50 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Logo */}
        <div className={cn(
          'relative rounded-lg overflow-hidden',
          'shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]',
          'transition-all duration-300 group-hover:scale-110',
          sizeClasses[size]
        )}>
          <Image
            src="/logo.png"
            alt="MindMap Pro"
            width={48}
            height={48}
            className={cn(
              'object-contain filter brightness-110',
              'group-hover:brightness-125 transition-all duration-300',
              sizeClasses[size]
            )}
            priority
          />
        </div>
      </div>
    </Link>
  );
}

/**
 * Logo for Dashboard/Sidebar
 */
export function DashboardLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="relative">
      {collapsed ? (
        <LogoIcon size="md" className="mx-auto" />
      ) : (
        <Logo size="md" />
      )}
    </div>
  );
}
