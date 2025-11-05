'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Sparkles, Users, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { Logo } from '@/components/logo';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/language-context';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setTheme } = useTheme();
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t('home.features.intelligent.title'),
      description: t('home.features.intelligent.description'),
    },
    {
      icon: Sparkles,
      title: t('home.features.aiPowered.title'),
      description: t('home.features.aiPowered.description'),
    },
    {
      icon: Users,
      title: t('home.features.teamCollaboration.title'),
      description: t('home.features.teamCollaboration.description'),
    },
    {
      icon: Zap,
      title: t('home.features.lightningFast.title'),
      description: t('home.features.lightningFast.description'),
    },
  ];
  // ✅ Kiểm tra token trong localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setTheme('dark');
  }, [setTheme]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cosmic Grid Background */}
      <div className="absolute inset-0 cosmic-grid opacity-20" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow animation-delay-2000" />

      {/* ✅ Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto backdrop-blur-sm">
        <Logo size="md" />

        <div className="flex items-center gap-3">
          <LanguageToggle />
          
          {/* Khi chưa đăng nhập */}
          {!isLoggedIn && (
            <>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/auth/login">{t('nav.login')}</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">{t('nav.getStarted')}</Link>
              </Button>
            </>
          )}

          {/* Khi đã đăng nhập */}
          {isLoggedIn && (
            <Button asChild>
              <Link href="/dashboard">{t('nav.dashboard')}</Link>
            </Button>
          )}
        </div>
      </nav>

      {/* ✅ Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center space-y-8">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-medium backdrop-blur-sm">
              ✨ {t('home.tagline')}
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold font-display tracking-tight">
            {t('home.title')}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 animate-shimmer">
              {t('home.titleHighlight')}
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t('home.description')}
            <br />
            Experience the <span className="text-cyan-400 font-semibold">{t('home.descriptionHighlight')}</span>.
          </p>

          {/* CTA Buttons */}
          {!isLoggedIn ? (
            <div className="flex justify-center space-x-4 pt-4">
              <Button size="lg" asChild className="group">
                <Link href="/auth/signup">
                  <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  {t('home.startFreeTrial')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">{t('nav.signIn')}</Link>
              </Button>
            </div>
          ) : (
            <div className="flex justify-center space-x-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  <Brain className="mr-2 h-5 w-5" />
                  {t('home.goToDashboard')}
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* ✅ Features Grid */}
        <div className="relative mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden node-glow"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <CardTitle className="text-lg font-display">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  {feature.description}
                </CardDescription>
              </CardContent>

              {/* Neural connection line */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          ))}
        </div>

        {/* ✅ CTA Section */}
        <div className="relative mt-32 text-center">
          <Card className="max-w-2xl mx-auto relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-emerald-500/10 blur-xl" />

            <CardHeader className="relative z-10">
              <CardTitle className="text-3xl font-display mb-2">
                {t('home.cta.title')}
              </CardTitle>
              <CardDescription className="text-lg text-gray-400">
                {t('home.cta.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              {!isLoggedIn ? (
                <Button size="lg" className="w-full sm:w-auto group" asChild>
                  <Link href="/auth/signup">
                    <Brain className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                    {t('home.cta.button')}
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/dashboard">
                    <Zap className="mr-2 h-5 w-5" />
                    {t('home.goToDashboard')}
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
