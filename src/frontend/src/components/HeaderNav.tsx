import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet';
import { Menu, Search, LogIn, LogOut, Ghost, Settings, BookPlus } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetLogo, createLogoUrl } from '../hooks/useLogo';
import { SearchBar } from './SearchBar';
import { FollowButton } from './FollowButton';
import { categories } from '../lib/categories';

export function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: logo } = useGetLogo();
  const navigate = useNavigate();

  const logoUrl = createLogoUrl(logo || null);

  // Clean up logo URL on unmount
  useEffect(() => {
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [logoUrl]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate({ to: '/search', search: { q: query } });
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-destructive/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Site logo"
                className="h-8 max-w-[150px] sm:max-w-[200px] object-contain"
              />
            ) : (
              <>
                <Ghost className="h-8 w-8 text-destructive group-hover:animate-pulse" />
                <span className="text-xl sm:text-2xl font-creepster text-destructive hidden sm:inline">
                  Darr Ka Samna
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {categories.map((category) => (
              <Link
                key={category.id}
                to="/category/$categoryId"
                params={{ categoryId: category.id }}
                className="text-sm font-medium text-foreground/80 hover:text-destructive transition-colors"
              >
                {category.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <FollowButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-foreground/80 hover:text-destructive"
            >
              <Search className="h-5 w-5" />
            </Button>
            {identity && (
              <>
                <Link to="/admin/story/new">
                  <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-destructive">
                    <BookPlus className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/admin/logo">
                  <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-destructive">
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            )}
            <Button
              onClick={identity ? clear : login}
              disabled={isLoggingIn}
              variant={identity ? 'outline' : 'default'}
              className={identity ? 'border-destructive/30' : 'bg-destructive hover:bg-destructive/90'}
            >
              {identity ? (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-foreground/80 hover:text-destructive"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-destructive">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background border-destructive/20">
                <SheetHeader>
                  <SheetTitle className="text-destructive font-creepster text-2xl">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-8">
                  {/* Follow Button in Mobile Menu */}
                  <div className="pb-4 border-b border-destructive/20">
                    <FollowButton />
                  </div>

                  {/* Categories */}
                  <nav className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Categories
                    </h3>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to="/category/$categoryId"
                        params={{ categoryId: category.id }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-base text-foreground/80 hover:text-destructive transition-colors py-2"
                      >
                        {category.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Admin Actions */}
                  {identity && (
                    <div className="flex flex-col gap-3 pt-4 border-t border-destructive/20">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Admin
                      </h3>
                      <Link
                        to="/admin/story/new"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-base text-foreground/80 hover:text-destructive transition-colors py-2"
                      >
                        <BookPlus className="h-5 w-5" />
                        Add Story
                      </Link>
                      <Link
                        to="/admin/logo"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-base text-foreground/80 hover:text-destructive transition-colors py-2"
                      >
                        <Settings className="h-5 w-5" />
                        Logo Settings
                      </Link>
                    </div>
                  )}

                  {/* Auth Button */}
                  <div className="pt-4 border-t border-destructive/20">
                    <Button
                      onClick={() => {
                        if (identity) {
                          clear();
                        } else {
                          login();
                        }
                        setMobileMenuOpen(false);
                      }}
                      disabled={isLoggingIn}
                      variant={identity ? 'outline' : 'default'}
                      className={`w-full ${identity ? 'border-destructive/30' : 'bg-destructive hover:bg-destructive/90'}`}
                    >
                      {identity ? (
                        <>
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-4 border-t border-destructive/20">
            <SearchBar onSearch={handleSearch} />
          </div>
        )}
      </div>
    </header>
  );
}
