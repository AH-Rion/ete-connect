import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, LogOut, User, LayoutDashboard, X } from 'lucide-react';
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const initials = (profile?.full_name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-1 shadow-[0_4px_30px_rgba(99,102,241,0.15)]'
          : 'py-2'
      }`}
      style={{
        background: scrolled
          ? 'rgba(15, 23, 42, 0.85)'
          : 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glowing bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent blur-sm" />

      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.img
            src={eteLogo}
            alt="ETE Family"
            className="w-9 h-9 object-contain"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(249,115,22,0.3))' }}
          />
          <motion.span
            className="font-heading font-bold text-xl text-white/90 group-hover:text-white transition-colors duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-shift_3s_ease_infinite]">
              ETE
            </span>{' '}
            Family
          </motion.span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 group"
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    layoutId="navActivePill"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
                      border: '1px solid rgba(99,102,241,0.25)',
                      boxShadow: '0 0 15px rgba(99,102,241,0.15), inset 0 0 15px rgba(99,102,241,0.05)',
                    }}
                  />
                )}
                <motion.span
                  className={`relative z-10 font-heading text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/60 group-hover:text-white/90 group-hover:-translate-y-[1px]'
                  }`}
                  style={{ display: 'inline-block' }}
                  whileHover={{ y: isActive ? 0 : -1 }}
                >
                  {link.label}
                </motion.span>
                {/* Hover underline */}
                {!isActive && (
                  <span className="absolute bottom-1 left-1/2 w-0 h-[2px] bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4" />
                )}
                {/* Active bottom glow dot */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent"
                    layoutId="navActiveDot"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    style={{ boxShadow: '0 0 8px rgba(249,115,22,0.6)' }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  className="rounded-full ring-2 ring-primary/50 ring-offset-2 ring-offset-transparent hover:ring-primary transition-all duration-300"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-heading font-bold text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass-dark border-primary/20">
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button asChild className="relative font-heading rounded-full px-7 py-2 overflow-hidden border-0 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
                }}
              >
                <Link to="/login">
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full animate-[shine_3s_ease-in-out_infinite]" />
                </Link>
              </Button>
            </motion.div>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <motion.button
                className="text-white/80 hover:text-white p-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-primary/10" style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)' }}>
              <div className="flex flex-col gap-1 mt-8">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-4 py-3 rounded-xl font-heading font-medium transition-all duration-300 ${
                          isActive
                            ? 'bg-primary/15 text-primary border border-primary/20'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="border-t border-white/10 my-4" />
                {isAuthenticated ? (
                  <>
                    {profile?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl font-heading font-medium text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="px-4 py-3 rounded-xl font-heading font-medium text-destructive hover:bg-destructive/10 text-left flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full font-heading rounded-full text-white" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }}>
                      Login
                    </Button>
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
