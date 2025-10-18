import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleProvider from './GoogleProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MindMap Pro - AI-Powered Mind Mapping',
  description: 'Create, organize, and share your ideas with intelligent mind mapping tools',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <GoogleProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}