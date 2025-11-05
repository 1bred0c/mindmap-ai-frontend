'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { GoogleLogin } from '@react-oauth/google';
import { Logo } from '@/components/logo';
import { useLanguage } from '@/contexts/language-context';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080/api/v1';
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      const res = await fetch(`${API_ENDPOINT}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error('Login error:', { status: res.status, data: errorData });
        throw new Error(errorData?.message || `Login failed with status ${res.status}`);
      }

      const data = await res.json();
      const { token, userId, fullName, avatarUrl, role } = data;

      // ✅ Lưu thông tin vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ userId, fullName, avatarUrl, role }));

      // ✅ Chuyển hướng sau khi login thành công (role-based)
      if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      alert(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const idToken = credentialResponse.credential;
      // Gửi idToken về backend
      const res = await fetch(`${API_ENDPOINT}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error('Google login failed');
      if (!res.ok) throw new Error('Google login failed');
      const { token, userId, fullName, avatarUrl, role } = await res.json();

      // 🔐 Lưu token và user info vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ userId, fullName, avatarUrl, role }));


      router.push('/dashboard');
    } catch (err) {
      alert('Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 cosmic-grid opacity-20" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow"
        style={{ animationDelay: '2s' }} />

      {/* Language Toggle - Fixed Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageToggle />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 space-y-6">
        {/* Header with Logo */}
        <div className="flex items-center justify-center mb-4">
          <Logo size="lg" />
        </div>

        <Card className="backdrop-blur-2xl">
          <CardHeader className="text-center space-y-3">
            <CardTitle className="text-3xl font-display">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {t('auth.login.title')}
              </span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              {t('auth.login.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.login.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.login.emailPlaceholder')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.login.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.login.passwordPlaceholder')}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  {t('auth.login.forgotPassword')}
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('auth.login.signingIn') : t('auth.login.signIn')}
              </Button>
            </form>

            <Separator />

            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert('Google login failed')}
                useOneTap
                theme="filled_blue"
                size="large"
                shape="pill"
              />
            </div>

            <p className="text-center text-sm text-gray-400">
              {t('auth.login.noAccount')}{' '}
              <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                {t('auth.login.signUp')}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}