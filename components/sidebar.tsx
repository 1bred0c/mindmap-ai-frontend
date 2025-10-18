'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Folder,
  Brain,
  Sparkles,
  CreditCard,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo, LogoIcon } from '@/components/logo';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Workspaces', href: '/workspaces', icon: Folder },
  { name: 'Mindmaps', href: '/mindmaps', icon: Brain },
  { name: 'AI', href: '/ai', icon: Sparkles },
  { name: 'Pricing', href: '/pricing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r">
            <SidebarContent pathname={pathname} onLinkClick={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={cn('hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col', className)}>
        <SidebarContent pathname={pathname} />
      </div>
    </>
  );
}

interface SidebarContentProps {
  pathname: string;
  onLinkClick?: () => void;
}

function SidebarContent({ pathname, onLinkClick }: SidebarContentProps) {
  return (
    <div className="flex flex-col flex-grow bg-background border-r backdrop-blur-xl bg-opacity-95">
      {/* Logo Section with Neon Glow */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-purple-500/20">
        <Logo size="md" />
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white dark:text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] border border-purple-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/5 hover:text-purple-600 dark:hover:text-white hover:shadow-[0_0_10px_rgba(139,92,246,0.2)]'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 transition-all duration-200',
                  isActive 
                    ? 'text-cyan-400' 
                    : 'text-gray-500 group-hover:text-purple-400'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}