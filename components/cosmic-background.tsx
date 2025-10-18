'use client';

import React from 'react';

/**
 * Cosmic Background Component
 * Creates an immersive neural network background with animated effects
 */
export function CosmicBackground() {
  return (
    <>
      {/* Cosmic Grid */}
      <div className="fixed inset-0 cosmic-grid opacity-20 pointer-events-none z-0" />
      
      {/* Floating Orbs */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none z-0" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none z-0" 
           style={{ animationDelay: '2s' }} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl animate-neural-pulse pointer-events-none z-0" />
      
      {/* Neural Network Lines */}
      <svg 
        className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#00ffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* Animated neural lines */}
        <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="url(#line-gradient)" strokeWidth="1">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" />
        </line>
        <line x1="90%" y1="30%" x2="10%" y2="70%" stroke="url(#line-gradient)" strokeWidth="1">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="5s" repeatCount="indefinite" />
        </line>
        <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="url(#line-gradient)" strokeWidth="1">
          <animate attributeName="opacity" values="0.1;0.5;0.1" dur="6s" repeatCount="indefinite" />
        </line>
      </svg>
    </>
  );
}

/**
 * Particle Effect Component
 * Floating particles for enhanced depth
 */
export function ParticleEffect() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-purple-400/20"
          style={{
            left: particle.left,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
