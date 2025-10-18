'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface NeuralNodeProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'green';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Neural Node Component
 * A glowing node component that mimics neurons in a neural network
 * Perfect for mindmap nodes or any interconnected elements
 */
export function NeuralNode({ 
  children, 
  className, 
  glowColor = 'purple',
  size = 'md' 
}: NeuralNodeProps) {
  const sizeClasses = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg',
  };

  const glowClasses = {
    cyan: 'shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] border-cyan-500/30',
    purple: 'shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border-purple-500/30',
    green: 'shadow-[0_0_20px_rgba(0,255,179,0.3)] hover:shadow-[0_0_30px_rgba(0,255,179,0.5)] border-emerald-500/30',
  };

  return (
    <div
      className={cn(
        'relative rounded-lg bg-card/60 backdrop-blur-xl border transition-all duration-300',
        'hover:scale-105 hover:z-10',
        sizeClasses[size],
        glowClasses[glowColor],
        className
      )}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Pulse effect */}
      <div className={cn(
        "absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        glowColor === 'cyan' && "bg-cyan-500/10",
        glowColor === 'purple' && "bg-purple-500/10",
        glowColor === 'green' && "bg-emerald-500/10"
      )} />
    </div>
  );
}

/**
 * Neural Connection Line Component
 * Animated connecting line between nodes
 */
interface NeuralConnectionProps {
  color?: 'cyan' | 'purple' | 'green';
  orientation?: 'horizontal' | 'vertical' | 'diagonal';
}

export function NeuralConnection({ 
  color = 'purple', 
  orientation = 'horizontal' 
}: NeuralConnectionProps) {
  const colorClasses = {
    cyan: 'from-transparent via-cyan-500/60 to-transparent',
    purple: 'from-transparent via-purple-500/60 to-transparent',
    green: 'from-transparent via-emerald-500/60 to-transparent',
  };

  const orientationClasses = {
    horizontal: 'w-full h-[2px]',
    vertical: 'h-full w-[2px]',
    diagonal: 'w-full h-[2px] transform rotate-45',
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className={cn(
          'bg-gradient-to-r',
          colorClasses[color],
          orientationClasses[orientation]
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

/**
 * Node Cluster Component
 * Groups neural nodes with connecting lines
 */
interface NodeClusterProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function NodeCluster({ children, className, title }: NodeClusterProps) {
  return (
    <div className={cn('relative p-6 rounded-xl border border-white/5 bg-card/20 backdrop-blur-sm', className)}>
      {title && (
        <h3 className="text-lg font-display font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          {title}
        </h3>
      )}
      <div className="space-y-4">
        {children}
      </div>
      
      {/* Decorative corner glows */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-purple-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2" />
    </div>
  );
}
