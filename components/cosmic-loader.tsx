'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CosmicLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

/**
 * Cosmic Loader Component
 * Beautiful loading spinner with neural network theme
 */
export function CosmicLoader({ size = 'md', className, text }: CosmicLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      {/* Main spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div
          className={cn(
            'rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin',
            sizeClasses[size]
          )}
        />
        
        {/* Inner glow */}
        <div
          className={cn(
            'absolute inset-0 rounded-full bg-purple-500/20 blur-md animate-pulse',
            sizeClasses[size]
          )}
        />
      </div>

      {/* Optional text */}
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );
}

/**
 * Neural Pulse Loader
 * Three pulsing dots in sequence
 */
export function NeuralPulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex space-x-2', className)}>
      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
      <div 
        className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" 
        style={{ animationDelay: '0.2s' }} 
      />
      <div 
        className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" 
        style={{ animationDelay: '0.4s' }} 
      />
    </div>
  );
}

/**
 * Skeleton Loader with gradient
 */
interface SkeletonProps {
  className?: string;
  count?: number;
}

export function CosmicSkeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-lg bg-gradient-to-r from-card/50 via-card/80 to-card/50',
            'animate-shimmer bg-[length:200%_100%]',
            className
          )}
        />
      ))}
    </>
  );
}

/**
 * Full Page Loader
 */
export function FullPageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated logo or icon */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" 
               style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
        </div>
        
        {/* Text */}
        <div className="space-y-2">
          <p className="text-xl font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            {text}
          </p>
          <NeuralPulseLoader className="justify-center" />
        </div>
      </div>
    </div>
  );
}

/**
 * Button Loader (for button loading states)
 */
export function ButtonLoader({ className }: { className?: string }) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      <span>Loading...</span>
    </div>
  );
}

/**
 * Card Skeleton Loader
 */
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-white/10 bg-card/50 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <CosmicSkeleton className="w-12 h-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <CosmicSkeleton className="h-6 w-3/4" />
              <CosmicSkeleton className="h-4 w-1/2" />
            </div>
          </div>
          <CosmicSkeleton className="h-4 w-full" />
          <CosmicSkeleton className="h-4 w-5/6" />
          <CosmicSkeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}
