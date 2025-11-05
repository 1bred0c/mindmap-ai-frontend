'use client';

import { Sidebar } from '@/components/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoIcon } from '@/components/logo';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [userData, setUserData] = useState<any>(null);
  const { t } = useLanguage();

  // ✅ Lấy thông tin user từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUserData(JSON.parse(storedUser));
  }, []);

  // ✅ Xử lý logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <header className="bg-background border-b h-16 flex items-center justify-between px-4 lg:px-6">
          {/* Logo on mobile */}
          <div className="lg:hidden">
            <LogoIcon size="sm" />
          </div>

          <div className="flex items-center space-x-4 w-full justify-between lg:justify-end">
            {/* ✅ Avatar + user info (click được để xem profile) */}
            <Link
              href="/profile"
              className="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={userData?.avatarUrl || '/default-avatar.png'}
                  alt={userData?.fullName || 'User avatar'}
                />
                <AvatarFallback>
                  {userData?.fullName ? userData.fullName.charAt(0) : '?'}
                </AvatarFallback>
              </Avatar>


            </Link>

            {/* ✅ Bên phải: LanguageToggle + ThemeToggle + Logout */}
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t('common.logout') || 'Logout'}</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
