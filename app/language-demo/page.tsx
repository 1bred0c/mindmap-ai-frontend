'use client';

import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LanguageToggle } from '@/components/language-toggle';
import { Check, Globe, Sparkles } from 'lucide-react';

export default function LanguageDemoPage() {
  const { t, language } = useLanguage();

  const translationKeys = [
    { key: 'home.title', category: 'Home Page' },
    { key: 'home.description', category: 'Home Page' },
    { key: 'auth.login.title', category: 'Auth' },
    { key: 'dashboard.title', category: 'Dashboard' },
    { key: 'mindmap.editor.addNode', category: 'Mind Map' },
    { key: 'pricing.title', category: 'Pricing' },
    { key: 'common.save', category: 'Common' },
    { key: 'common.delete', category: 'Common' },
  ];

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 cosmic-grid opacity-20" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" 
           style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="mb-4">
            <Globe className="mr-2 h-4 w-4" />
            Language System Demo
          </Badge>
          
          <h1 className="text-5xl font-bold font-display">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              🌐 Hệ thống Đa ngôn ngữ
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Demo hệ thống chuyển đổi ngôn ngữ chuyên nghiệp giữa tiếng Việt và tiếng Anh
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <LanguageToggle />
            <Badge variant="outline" className="text-lg py-2 px-4">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Current: {language === 'en' ? '🇬🇧 English' : '🇻🇳 Tiếng Việt'}
            </Badge>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Key Features
              </CardTitle>
              <CardDescription>
                Các tính năng chính của hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Chuyển đổi liền mạch giữa 2 ngôn ngữ</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Lưu trữ lựa chọn vào localStorage</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>UI/UX hiện đại với animations</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Responsive trên mọi thiết bị</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Zero performance impact</span>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-cyan-400" />
                Technical Info
              </CardTitle>
              <CardDescription>
                Thông tin kỹ thuật
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Framework:</span>
                <Badge>Next.js 13+</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">State:</span>
                <Badge>React Context</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Storage:</span>
                <Badge>localStorage</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Bundle Size:</span>
                <Badge variant="outline">~5KB</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Languages:</span>
                <div className="flex gap-2">
                  <Badge>🇬🇧 EN</Badge>
                  <Badge>🇻🇳 VI</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Translation Examples */}
        <Card className="backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Live Translation Examples</CardTitle>
            <CardDescription>
              Các ví dụ bản dịch theo thời gian thực - thay đổi ngôn ngữ để xem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {translationKeys.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <code className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                      {item.key}
                    </code>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Category: {item.category}
                    </p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-lg font-medium">
                      {t(item.key)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="backdrop-blur-xl border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-400">How to Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="font-semibold">1. Click the language toggle button at the top</p>
              <p className="text-sm text-muted-foreground ml-4">
                → Choose between 🇬🇧 English or 🇻🇳 Tiếng Việt
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">2. Watch all text change instantly</p>
              <p className="text-sm text-muted-foreground ml-4">
                → All translations update in real-time
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">3. Refresh the page</p>
              <p className="text-sm text-muted-foreground ml-4">
                → Your language preference is saved and persists
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">4. Navigate to other pages</p>
              <p className="text-sm text-muted-foreground ml-4">
                → Language setting applies across the entire app
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-bold">
            Ready to explore?
          </h2>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <a href="/">Go to Home</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
