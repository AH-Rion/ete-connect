import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import eteLogo from '@/assets/ete-logo.png';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Alumni Directory', path: '/alumni' },
  { label: 'Register as Alumni', path: '/register' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, profile, signOut, user } = useAuth();
  const location = useLocation();

  const isHeroPage = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navStyle = scrolled || !isHeroPage ? 'glass-light' : 'glass-dark';

  const initials = (profile?.full_name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navStyle}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={eteLogo} alt="ETE Family" className="w-9 h-9 object-contain" />
          <span className={`font-heading font-bold text-xl transition-colors duration-300 ${scrolled || !isHeroPage ? 'text-foreground' : 'text-white'}`}>
            <span className="text-primary">ETE</span> Family
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2 font-heading text-sm font-medium transition-all duration-200
                ${scrolled || !isHeroPage ? 'text-foreground hover:text-primary' : 'text-white/80 hover:text-white'}
                ${location.pathname === link.path ? '' : ''}
              `}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"
                  layoutId="navUnderline"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full ring-2 ring-primary ring-offset-2 ring-offset-transparent">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-heading font-bold text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/register" className="flex items-center gap-2">
                    <User className="w-4 h-4" /> My Registration
                  </Link>
                </DropdownMenuItem>
                {profile?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
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
            <Button asChild className="btn-gradient-primary font-heading rounded-full px-6">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className={scrolled || !isHeroPage ? 'text-foreground' : 'text-white'}>
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-2 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-lg font-heading font-medium transition-colors hover:bg-muted
                      ${location.pathname === link.path ? 'bg-primary/10 text-primary' : 'text-foreground'}
                    `}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-border my-4" />
                {isAuthenticated ? (
                  <>
                    {profile?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg font-heading font-medium text-foreground hover:bg-muted flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="px-4 py-3 rounded-lg font-heading font-medium text-destructive hover:bg-destructive/10 text-left flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full btn-gradient-primary font-heading">Login</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
};
