import { Outlet } from '@tanstack/react-router';
import { HeaderNav } from './HeaderNav';
import { Heart } from 'lucide-react';

export function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <HeaderNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} Darr Ka Samna. All rights reserved.
            </p>
            <p className="flex items-center gap-2 text-center md:text-right">
              Built with <Heart className="text-destructive inline-block h-4 w-4 fill-current" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'darr-ka-samna'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-destructive hover:text-destructive/80 transition-colors underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
