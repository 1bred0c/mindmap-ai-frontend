'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NeuralNode, NodeCluster } from '@/components/neural-node';
import { CosmicBackground, ParticleEffect } from '@/components/cosmic-background';
import { Brain, Sparkles, Zap, Star } from 'lucide-react';

/**
 * Theme Showcase Page
 * Demonstrates all cosmic theme components and effects
 */
export default function ThemeShowcase() {
  return (
    <div className="min-h-screen relative">
      <CosmicBackground />
      <ParticleEffect />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold font-display">
            <span className="gradient-text-animated">
              Cosmic Theme Showcase
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Explore the neural universe of design components
          </p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-display text-glow-cyan">
            Buttons
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button>Default Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button size="lg">
              <Sparkles className="mr-2" />
              Large with Icon
            </Button>
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-display text-glow-purple">
            Glass Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-cyan-400" />
                  Standard Card
                </CardTitle>
                <CardDescription>
                  This is a glass morphism card with backdrop blur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Hover over me to see the glow effect!
                </p>
              </CardContent>
            </Card>

            <Card className="holographic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  Holographic Card
                </CardTitle>
                <CardDescription>
                  With holographic effect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Watch the shifting colors!
                </p>
              </CardContent>
            </Card>

            <Card className="scan-line">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-400" />
                  Scan Line Card
                </CardTitle>
                <CardDescription>
                  With scan line animation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  See the scanning effect!
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Neural Nodes Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-display text-glow-green">
            Neural Nodes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NeuralNode glowColor="cyan" size="md">
              <div className="text-center">
                <Star className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Cyan Node</h3>
                <p className="text-sm text-gray-400">Perfect for connections</p>
              </div>
            </NeuralNode>

            <NeuralNode glowColor="purple" size="md">
              <div className="text-center">
                <Brain className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Purple Node</h3>
                <p className="text-sm text-gray-400">Primary accent color</p>
              </div>
            </NeuralNode>

            <NeuralNode glowColor="green" size="md">
              <div className="text-center">
                <Zap className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Green Node</h3>
                <p className="text-sm text-gray-400">Success states</p>
              </div>
            </NeuralNode>
          </div>
        </section>

        {/* Node Cluster */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-display">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Node Clusters
            </span>
          </h2>
          <NodeCluster title="Connected Ideas">
            <div className="space-y-4">
              <NeuralNode glowColor="cyan" size="sm">
                <p className="text-sm text-white">Idea 1: Core Concept</p>
              </NeuralNode>
              <div className="ml-8 space-y-4">
                <NeuralNode glowColor="purple" size="sm">
                  <p className="text-sm text-white">Idea 2: Supporting Detail</p>
                </NeuralNode>
                <NeuralNode glowColor="green" size="sm">
                  <p className="text-sm text-white">Idea 3: Implementation</p>
                </NeuralNode>
              </div>
            </div>
          </NodeCluster>
        </section>

        {/* Input Fields */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-display text-glow-cyan">
            Input Fields
          </h2>
          <div className="max-w-md space-y-4">
            <Input placeholder="Email address" type="email" />
            <Input placeholder="Password" type="password" />
            <Input placeholder="Search ideas..." />
          </div>
        </section>

        {/* Text Effects */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-display">
            <span className="gradient-text-animated">
              Text Effects
            </span>
          </h2>
          <div className="space-y-4">
            <p className="text-glow-cyan text-2xl">Cyan Glow Text</p>
            <p className="text-glow-purple text-2xl">Purple Glow Text</p>
            <p className="text-glow-green text-2xl">Green Glow Text</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">
              Gradient Text
            </p>
          </div>
        </section>

        {/* Loading States */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-display text-glow-purple">
            Loading States
          </h2>
          <div className="flex items-center gap-8">
            <div className="cosmic-spinner" />
            <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </section>

        {/* Hover Effects */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-display text-glow-green">
            Hover Effects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Hover Lift</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">I lift up on hover!</p>
              </CardContent>
            </Card>

            <Card className="energy-field">
              <CardHeader>
                <CardTitle>Energy Field</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Hover for energy glow!</p>
              </CardContent>
            </Card>

            <Card className="node-glow">
              <CardHeader>
                <CardTitle>Node Glow</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Hover for node effect!</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Background Patterns */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-display">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Background Patterns
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cosmic-grid h-40 rounded-lg border border-white/10 bg-card/30 backdrop-blur-sm" />
            <div className="circuit-pattern h-40 rounded-lg border border-white/10 bg-card/30 backdrop-blur-sm" />
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-12 border-t border-white/10">
          <p className="text-gray-500">
            ✨ Built with the Cosmic Theme System
          </p>
          <p className="text-sm text-gray-600 mt-2">
            &ldquo;Where ideas connect through light and energy&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
