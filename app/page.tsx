'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Sparkles, Users, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const features = [
  {
    icon: Brain,
    title: 'Intelligent Mind Mapping',
    description: 'Create beautiful, organized mind maps with our intuitive drag-and-drop editor.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Suggestions',
    description: 'Get smart suggestions and auto-generate mind maps from your ideas.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share and collaborate on mind maps with your team in real-time.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed and performance, even with complex mind maps.',
  },
];

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Kiểm tra token trong localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* ✅ Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-primary">MindMap Pro</h1>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {/* Khi chưa đăng nhập */}
          {!isLoggedIn && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}

          {/* Khi đã đăng nhập */}
          {isLoggedIn && (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
        </div>
      </nav>

      {/* ✅ Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Organize Your Ideas with{' '}
            <span className="text-primary">AI-Powered</span> Mind Maps
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your thoughts into beautiful, organized mind maps. Boost productivity
            and creativity with our intelligent mind mapping platform.
          </p>

          {/* CTA Buttons */}
          {!isLoggedIn ? (
            <div className="flex justify-center space-x-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          ) : (
            <div className="flex justify-center space-x-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          )}
        </div>

        {/* ✅ Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ✅ CTA Section */}
        <div className="mt-24 text-center">
          <Card className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of users who are already organizing their ideas better.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isLoggedIn ? (
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/auth/signup">Create Your First Mind Map</Link>
                </Button>
              ) : (
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
