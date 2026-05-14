import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, LogOut, User, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Alumni', path: '/alumni' },
  { label: 'Register', path: '/register' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`w-9 h-9 rounded-[10px] flex items-center justify-center border transition-colors ${className}`}
      style={{
        background: 'hsl(var(--muted) / 0.5)',
        borderColor: 'hsl(var(--border))',
        color: 'hsl(var(--foreground))',
      }}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, profile, signOut, user } = useAuth();
  const location = useLocation();

  const initials = (profile?.full_name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'hsl(var(--background) / 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid hsl(var(--border))',
      }}
    >
      <div className="max-w-[72rem] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white font-bold"
            style={{
              background: 'linear-gradient(135deg, #0052FF, #4D7CFF)',
              boxShadow: '0 4px 12px rgba(0, 82, 255, 0.3)',
              fontFamily: "'Calistoga', serif",
            }}
          >
            E
          </div>
          <span
            className="text-[17px] font-semibold tracking-tight"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            ETE Family
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 text-[14px] transition-colors duration-200 hover:text-foreground"
                style={{
                  color: isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full transition-all duration-200 hover:ring-2 hover:ring-offset-2" style={{ outline: 'none' }}>
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback
                      className="text-white font-semibold text-sm"
                      style={{ background: 'linear-gradient(135deg, #0052FF, #4D7CFF)' }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/register" className="flex items-center gap-2">
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                </DropdownMenuItem>
                {profile?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 text-destructive">
                  <LogOut className="w-4 h-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login" className="btn-secondary-outline text-[14px]" style={{ height: '40px' }}>
                Sign in
              </Link>
              <Link to="/register" className="btn-primary-grad text-[14px]" style={{ height: '40px' }}>
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="p-2 rounded-lg" style={{ color: 'hsl(var(--foreground))' }}>
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-1 mt-8">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 rounded-xl text-[14px] transition-colors"
                      style={{
                        color: isActive ? '#0052FF' : 'hsl(var(--foreground))',
                        background: isActive ? 'rgba(0, 82, 255, 0.06)' : 'transparent',
                        fontWeight: 500,
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="border-t border-border my-4" />
                {isAuthenticated ? (
                  <>
                    {profile?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl flex items-center gap-2 text-[14px]" style={{ color: 'hsl(var(--foreground))' }}>
                        <LayoutDashboard className="w-4 h-4" /> Admin
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="px-4 py-3 rounded-xl text-left flex items-center gap-2 text-destructive text-[14px]"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary-grad mt-2">
                    Sign in
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
