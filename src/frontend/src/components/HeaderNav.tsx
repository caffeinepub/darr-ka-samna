import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet';
import { Menu, Search, LogIn, LogOut, Ghost } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { SearchBar } from './SearchBar';
import { categories } from '../lib/categories';

export function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate({ to: '/search', search: { q: query } });
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-destructive/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Ghost className="h-8 w-8 text-destructive group-hover:animate-pulse" />
            <span className="text-2xl font-creepster text-destructive tracking-wider">
              Darr Ka Samna
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-foreground/80 hover:text-destructive transition-colors"
            >
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/category/$categoryId"
                params={{ categoryId: cat.id }}
                className="text-sm font-medium text-foreground/80 hover:text-destructive transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-foreground/80 hover:text-destructive"
            >
              <Search className="h-5 w-5" />
            </Button>

            {identity ? (
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="hidden md:flex items-center gap-2 border-destructive/30 hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="hidden md:flex items-center gap-2 border-destructive/30 hover:bg-destructive/10"
              >
                <LogIn className="h-4 w-4" />
                {isLoggingIn ? 'Signing In...' : 'Sign In'}
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-card border-destructive/20">
                <SheetHeader>
                  <SheetTitle className="text-destructive font-creepster text-xl">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-foreground/80 hover:text-destructive transition-colors"
                  >
                    Home
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to="/category/$categoryId"
                      params={{ categoryId: cat.id }}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium text-foreground/80 hover:text-destructive transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                  <div className="border-t border-border/50 pt-4 mt-4">
                    {identity ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          clear();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full border-destructive/30 hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => {
                          login();
                          setMobileMenuOpen(false);
                        }}
                        disabled={isLoggingIn}
                        className="w-full border-destructive/30 hover:bg-destructive/10"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        {isLoggingIn ? 'Signing In...' : 'Sign In'}
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-4 border-t border-border/50">
            <SearchBar onSearch={handleSearch} />
          </div>
        )}
      </div>
    </header>
  );
}
