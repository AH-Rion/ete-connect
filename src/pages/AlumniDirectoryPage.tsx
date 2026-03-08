import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Search, MapPin, Briefcase, Star, LayoutGrid, List, X,
  SearchX, ArrowRight, GraduationCap, Sparkles, Users, Building2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Alumni {
  id: string;
  full_name: string;
  graduation_year: number | null;
  job_title: string | null;
  company: string | null;
  city: string | null;
  country: string | null;
  industry: string | null;
  photo_url: string | null;
  department: string | null;
  skills: string | null;
  willing_to_mentor: boolean;
  employment_status: string | null;
}

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

// ─── Animated Card ───
const AlumniCard = ({
  alum,
  index,
  isHighlighted,
  onViewProfile,
}: {
  alum: Alumni;
  index: number;
  isHighlighted: boolean;
  onViewProfile: (id: string) => void;
}) => {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      layout
      className="perspective-[800px]"
    >
      <div
        onClick={() => setFlipped(!flipped)}
        className={`relative w-full h-[420px] cursor-pointer transition-transform duration-700 group ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ─── FRONT ─── */}
        <div
          className={`absolute inset-0 rounded-2xl overflow-hidden border backdrop-blur-xl transition-all duration-500
            ${isHighlighted
              ? 'border-accent/60 shadow-[0_0_40px_-5px_hsl(var(--accent)/0.4)] animate-pulse'
              : 'border-white/10 hover:border-primary/50 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)]'
            }
            group-hover:-translate-y-2`}
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          {/* Top gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent opacity-50 group-hover:opacity-100 transition-opacity" />

          {/* Spotlight glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full opacity-0 group-hover:opacity-25 blur-3xl transition-opacity duration-700 pointer-events-none"
            style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent 70%)' }} />

          {/* Featured label */}
          {isHighlighted && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-heading font-bold bg-accent/20 text-accent border border-accent/30 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            </div>
          )}

          <div className="flex flex-col items-center text-center p-6 pt-8 h-full">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-500" />
              <Avatar className="w-20 h-20 relative ring-2 ring-white/15 group-hover:ring-primary/50 transition-all duration-500 group-hover:scale-110">
                {alum.photo_url && (
                  <AvatarImage src={alum.photo_url} alt={alum.full_name} className="object-cover" loading="lazy" />
                )}
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-heading font-bold text-xl">
                  {getInitials(alum.full_name)}
                </AvatarFallback>
              </Avatar>
              {alum.willing_to_mentor && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]">
                  <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                </div>
              )}
            </div>

            {/* Name */}
            <h3 className="text-lg font-heading font-bold text-white group-hover:text-primary transition-colors duration-300 truncate max-w-full">
              {alum.full_name}
            </h3>

            {/* Batch badge */}
            {alum.graduation_year && (
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-heading bg-accent/15 text-accent border border-accent/20">
                <GraduationCap className="w-3 h-3" />
                Batch {alum.graduation_year}
              </span>
            )}

            {/* Job info */}
            <div className="mt-3 space-y-1.5">
              {alum.job_title && (
                <p className="flex items-center justify-center gap-1.5 text-sm text-white/60">
                  <Briefcase className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                  <span className="truncate">{alum.job_title}</span>
                </p>
              )}
              {alum.company && (
                <p className="flex items-center justify-center gap-1.5 text-sm text-white/50">
                  <Building2 className="w-3.5 h-3.5 text-secondary/70 shrink-0" />
                  <span className="truncate">{alum.company}</span>
                </p>
              )}
              {(alum.city || alum.country) && (
                <p className="flex items-center justify-center gap-1.5 text-xs text-white/40">
                  <MapPin className="w-3 h-3 text-accent/70 shrink-0" />
                  <span className="truncate">{[alum.city, alum.country].filter(Boolean).join(', ')}</span>
                </p>
              )}
            </div>

            {/* Skills */}
            {alum.skills && (
              <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                {alum.skills.split(',').slice(0, 3).map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-[10px] font-heading bg-white/5 text-white/50 border border-white/10 hover:bg-primary/15 hover:text-primary hover:border-primary/30 transition-all duration-300 cursor-default"
                  >
                    {s.trim()}
                  </span>
                ))}
                {alum.skills.split(',').length > 3 && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-heading bg-white/5 text-white/40 border border-white/10">
                    +{alum.skills.split(',').length - 3}
                  </span>
                )}
              </div>
            )}

            {/* View Profile button - pushed to bottom */}
            <div className="mt-auto pt-4 w-full">
              <button
                onClick={(e) => { e.stopPropagation(); onViewProfile(alum.id); }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-heading font-semibold bg-white/5 border border-white/10 text-white/70 hover:bg-primary/20 hover:border-primary/40 hover:text-white transition-all duration-300 group/btn"
              >
                View Profile
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── BACK ─── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl [transform:rotateY(180deg)]"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
          }}
        >
          <div className="h-1 w-full bg-gradient-to-r from-secondary via-primary to-accent" />
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <h3 className="text-xl font-heading font-bold text-white mb-2">{alum.full_name}</h3>

            {alum.willing_to_mentor && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading bg-accent/15 text-accent border border-accent/30 mb-4 animate-[pulse_2s_ease-in-out_infinite]">
                <Star className="w-3 h-3 fill-accent" /> Available as Mentor
              </span>
            )}

            <div className="space-y-3 w-full mb-6">
              {alum.job_title && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Briefcase className="w-4 h-4 text-primary/70 shrink-0" />
                  <span>{alum.job_title}</span>
                </div>
              )}
              {alum.company && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Building2 className="w-4 h-4 text-secondary/70 shrink-0" />
                  <span>{alum.company}</span>
                </div>
              )}
              {(alum.city || alum.country) && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <MapPin className="w-4 h-4 text-accent/70 shrink-0" />
                  <span>{[alum.city, alum.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {alum.industry && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <span className="text-xs">🏭</span>
                  <span>{alum.industry}</span>
                </div>
              )}
              {alum.employment_status && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <span className="text-xs">📋</span>
                  <span>{alum.employment_status}</span>
                </div>
              )}
            </div>

            {/* Skills full list */}
            {alum.skills && (
              <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                {alum.skills.split(',').map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-heading bg-primary/10 text-primary border border-primary/20">
                    {s.trim()}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); onViewProfile(alum.id); }}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-heading font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all duration-300 group/btn"
            >
              Full Profile
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>

            <p className="text-xs text-white/30 mt-3 font-body">Click card to flip back</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── List Row ───
const AlumniListRow = ({
  alum,
  index,
  onViewProfile,
}: {
  alum: Alumni;
  index: number;
  onViewProfile: (id: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      layout
      className="flex items-center gap-4 p-4 rounded-xl border border-white/10 backdrop-blur-xl hover:border-primary/40 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)] transition-all duration-500 group"
      style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
    >
      <Avatar className="w-14 h-14 ring-2 ring-white/10 group-hover:ring-primary/40 transition-all duration-500 shrink-0">
        {alum.photo_url && <AvatarImage src={alum.photo_url} alt={alum.full_name} loading="lazy" />}
        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-heading font-bold">
          {getInitials(alum.full_name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-bold text-white group-hover:text-primary transition-colors truncate">{alum.full_name}</h3>
          {alum.willing_to_mentor && (
            <Star className="w-3.5 h-3.5 text-accent fill-accent shrink-0 animate-[pulse_2s_ease-in-out_infinite]" />
          )}
        </div>
        <p className="text-sm text-white/50 font-body truncate">
          {alum.job_title}{alum.company ? ` @ ${alum.company}` : ''}
        </p>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {alum.graduation_year && (
            <span className="text-xs text-accent font-heading">Batch {alum.graduation_year}</span>
          )}
          {alum.city && (
            <span className="text-xs text-white/30 flex items-center gap-1"><MapPin className="w-3 h-3" />{alum.city}</span>
          )}
        </div>
      </div>
      <button
        onClick={() => onViewProfile(alum.id)}
        className="px-4 py-2 rounded-xl text-xs font-heading font-semibold bg-white/5 border border-white/10 text-white/70 hover:bg-primary/20 hover:border-primary/40 hover:text-white transition-all duration-300 shrink-0 group/btn flex items-center gap-1.5"
      >
        View <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </motion.div>
  );
};

// ─── Main Page ───
const AlumniDirectoryPage = () => {
  const { isAuthenticated } = useAuth();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [batchFilter, setBatchFilter] = useState<string>('all');
  const availableBatches = Array.from({ length: 2026 - 2016 + 1 }, (_, i) => 2026 - i);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const PAGE_SIZE = 12;

  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('alumni').select('*', { count: 'exact' }).eq('is_approved', true);

      if (batchFilter && batchFilter !== 'all') {
        query = query.eq('graduation_year', parseInt(batchFilter));
      }
      if (search) {
        query = query.or(`full_name.ilike.%${search}%,company.ilike.%${search}%,job_title.ilike.%${search}%,skills.ilike.%${search}%`);
      }

      switch (sortBy) {
        case 'name_asc': query = query.order('full_name', { ascending: true }); break;
        case 'name_desc': query = query.order('full_name', { ascending: false }); break;
        case 'batch_asc': query = query.order('graduation_year', { ascending: true }); break;
        case 'batch_desc': query = query.order('graduation_year', { ascending: false }); break;
        default: query = query.order('created_at', { ascending: false });
      }

      query = query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      const { data, count, error } = await query;
      if (error) throw error;
      setAlumni(data || []);
      setTotal(count || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, page, batchFilter]);

  useEffect(() => { fetchAlumni(); }, [fetchAlumni]);

  useEffect(() => {
    const timer = setTimeout(() => { setPage(0); }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Auto-highlight random alumni every 6 seconds
  useEffect(() => {
    if (alumni.length === 0) return;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * alumni.length);
      setHighlightedId(alumni[randomIndex].id);
    }, 6000);
    return () => clearInterval(interval);
  }, [alumni]);

  const handleViewProfile = (id: string) => {
    if (!isAuthenticated) { setLoginPrompt(true); return; }
    window.location.href = `/alumni/${id}`;
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #020617 0%, #0f0a2e 40%, #1a1145 60%, #0f0a2e 80%, #020617 100%)' }}
    >
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-[150px] animate-float" style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent 70%)' }} />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-[130px] animate-float" style={{ background: 'radial-gradient(circle, hsl(var(--secondary)), transparent 70%)', animationDelay: '3s' }} />
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm text-sm font-heading text-white/80 mb-6"
          >
            <Users className="w-4 h-4 text-accent" />
            Alumni Network
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-4"
          >
            Alumni{' '}
            <span className="text-gradient-hero">Directory</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/50 font-body mb-10 max-w-2xl mx-auto"
          >
            Browse and connect with our ETE alumni across the globe
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto relative"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, title, skills..."
              className="w-full pl-14 pr-12 py-4 rounded-2xl text-base font-body text-white bg-white/5 border border-white/10 backdrop-blur-xl placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)] transition-all duration-500"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Controls */}
      <section className="pb-6 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-2xl border border-white/10 backdrop-blur-xl"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <p className="text-sm text-white/40 font-body">
              Showing <span className="font-semibold text-white/70">{alumni.length}</span> of <span className="font-semibold text-white/70">{total}</span> alumni
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Select value={batchFilter} onValueChange={(v) => { setBatchFilter(v); setPage(0); }}>
                <SelectTrigger className="w-44 font-body text-sm bg-white/5 border-white/10 text-white/70 hover:border-primary/40 transition-colors">
                  <GraduationCap className="w-4 h-4 mr-2 text-white/30" />
                  <SelectValue placeholder="Filter by Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {availableBatches.map((year) => (
                    <SelectItem key={year} value={String(year)}>Batch {year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 font-body text-sm bg-white/5 border-white/10 text-white/70 hover:border-primary/40 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="name_asc">Name A-Z</SelectItem>
                  <SelectItem value="name_desc">Name Z-A</SelectItem>
                  <SelectItem value="batch_asc">Batch Year ↑</SelectItem>
                  <SelectItem value="batch_desc">Batch Year ↓</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-all duration-300 ${viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-all duration-300 ${viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="pb-20 relative z-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className={`grid ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''} gap-6`}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/10 p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <Skeleton className="h-20 w-20 rounded-full mx-auto bg-white/5" />
                  <Skeleton className="h-5 w-3/4 mx-auto bg-white/5" />
                  <Skeleton className="h-4 w-1/2 mx-auto bg-white/5" />
                  <Skeleton className="h-4 w-2/3 mx-auto bg-white/5" />
                </div>
              ))}
            </div>
          ) : alumni.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24"
            >
              <SearchX className="w-20 h-20 text-white/10 mx-auto mb-6" />
              <h3 className="text-2xl font-heading font-bold text-white mb-2">No Alumni Found</h3>
              <p className="text-white/40 font-body mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => setSearch('')}
                className="px-6 py-2.5 rounded-xl text-sm font-heading font-semibold bg-white/5 border border-white/10 text-white/70 hover:bg-primary/20 hover:border-primary/40 hover:text-white transition-all duration-300"
              >
                Clear search
              </button>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${batchFilter}-${sortBy}-${page}`}
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {alumni.map((alum, i) => (
                  <AlumniCard
                    key={alum.id}
                    alum={alum}
                    index={i}
                    isHighlighted={alum.id === highlightedId}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${batchFilter}-${sortBy}-${page}`}
                className="space-y-3"
              >
                {alumni.map((alum, i) => (
                  <AlumniListRow
                    key={alum.id}
                    alum={alum}
                    index={i}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-5 py-2.5 rounded-xl text-sm font-heading font-semibold bg-white/5 border border-white/10 text-white/60 hover:bg-primary/20 hover:border-primary/40 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                const pageNum = totalPages <= 7 ? i : (
                  page < 3 ? i :
                  page > totalPages - 4 ? totalPages - 7 + i :
                  page - 3 + i
                );
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-xl text-sm font-heading font-semibold transition-all duration-300 ${
                      page === pageNum
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_15px_hsl(var(--primary)/0.4)]'
                        : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-5 py-2.5 rounded-xl text-sm font-heading font-semibold bg-white/5 border border-white/10 text-white/60 hover:bg-primary/20 hover:border-primary/40 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Login Prompt Dialog */}
      <Dialog open={loginPrompt} onOpenChange={setLoginPrompt}>
        <DialogContent className="border-white/10 bg-[#0f0a2e] backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-center text-white">🔒 Login Required</DialogTitle>
          </DialogHeader>
          <p className="text-center text-white/50 font-body">Please login to view full alumni profiles and contact details.</p>
          <div className="flex gap-3 justify-center mt-4">
            <Button asChild className="bg-gradient-to-r from-primary to-secondary text-white font-heading hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/10 text-white/70 font-heading hover:bg-white/5">
              <Link to="/login?tab=signup">Sign Up</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AlumniDirectoryPage;
