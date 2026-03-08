import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Star, LayoutGrid, List, X, Filter, SearchX, ArrowRight, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { pageTransition } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

  const handleViewProfile = (id: string) => {
    if (!isAuthenticated) { setLoginPrompt(true); return; }
    window.location.href = `/alumni/${id}`;
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <motion.div {...pageTransition} className="pt-16">
      {/* Mini Hero */}
      <section className="gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 variants={fadeInUp} initial="hidden" animate="visible" className="text-3xl md:text-4xl font-heading font-bold text-text-on-dark mb-4">Alumni Directory</motion.h1>
          <p className="text-text-on-dark/70 font-body mb-8">Browse and connect with our ETE alumni across the globe</p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, title, skills..."
              className="pl-12 py-6 rounded-full text-base bg-card shadow-lg border-0"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="bg-background py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm text-muted-foreground font-body">
              Showing <span className="font-semibold text-foreground">{alumni.length}</span> of <span className="font-semibold text-foreground">{total}</span> alumni
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Select value={batchFilter} onValueChange={(v) => { setBatchFilter(v); setPage(0); }}>
                <SelectTrigger className="w-44 font-body text-sm">
                  <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
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
                <SelectTrigger className="w-40 font-body text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="name_asc">Name A-Z</SelectItem>
                  <SelectItem value="name_desc">Name Z-A</SelectItem>
                  <SelectItem value="batch_asc">Batch Year ↑</SelectItem>
                  <SelectItem value="batch_desc">Batch Year ↓</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border border-border rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="bg-background pb-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-6`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-card p-6 space-y-4">
                  <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                  <Skeleton className="h-5 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                </div>
              ))}
            </div>
          ) : alumni.length === 0 ? (
            <div className="text-center py-20">
              <SearchX className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">No Alumni Found</h3>
              <p className="text-muted-foreground font-body mb-4">Try adjusting your search or filters</p>
              <Button onClick={() => setSearch('')} variant="outline" className="font-heading">Clear search</Button>
            </div>
          ) : viewMode === 'grid' ? (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.map((alum) => (
                <motion.div key={alum.id} variants={fadeInUp} className="rounded-xl bg-card shadow-md overflow-hidden card-hover group">
                  <div className="h-16 gradient-hero" />
                  <div className="px-6 pb-6 -mt-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-xl font-heading font-bold text-accent-foreground mx-auto ring-4 ring-card">
                      {alum.full_name.charAt(0)}
                    </div>
                    <h3 className="font-heading font-bold text-foreground mt-3">{alum.full_name}</h3>
                    <Badge variant="secondary" className="mt-1 text-xs font-heading bg-accent/10 text-accent">
                      Batch {alum.graduation_year}
                    </Badge>
                    {alum.job_title && (
                      <p className="text-sm text-muted-foreground font-body mt-2 flex items-center justify-center gap-1">
                        <Briefcase className="w-3 h-3" /> {alum.job_title} {alum.company && `@ ${alum.company}`}
                      </p>
                    )}
                    {alum.city && (
                      <p className="text-xs text-muted-foreground/70 font-body mt-1 flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3" /> {alum.city}, {alum.country}
                      </p>
                    )}
                    {alum.industry && <Badge variant="outline" className="mt-2 text-xs">{alum.industry}</Badge>}
                    {alum.skills && (
                      <div className="flex flex-wrap justify-center gap-1 mt-2">
                        {alum.skills.split(',').slice(0, 3).map((s, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{s.trim()}</Badge>
                        ))}
                        {alum.skills.split(',').length > 3 && <Badge variant="outline" className="text-xs">+{alum.skills.split(',').length - 3}</Badge>}
                      </div>
                    )}
                    {alum.willing_to_mentor && (
                      <Badge className="mt-2 bg-accent/10 text-accent text-xs"><Star className="w-3 h-3 mr-1" />Mentor</Badge>
                    )}
                    <Button onClick={() => handleViewProfile(alum.id)} variant="ghost" className="mt-4 w-full font-heading text-accent hover:text-accent-hover group-hover:translate-x-0">
                      View Profile <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {alumni.map((alum) => (
                <motion.div key={alum.id} variants={fadeInUp} initial="hidden" animate="visible" className="flex items-center gap-4 p-4 rounded-xl bg-card shadow-sm card-hover">
                  <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-lg font-heading font-bold text-accent-foreground shrink-0">
                    {alum.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-foreground">{alum.full_name}</h3>
                    <p className="text-sm text-muted-foreground font-body truncate">{alum.job_title} {alum.company && `@ ${alum.company}`}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs font-heading">Batch {alum.graduation_year}</Badge>
                      {alum.city && <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{alum.city}</span>}
                    </div>
                  </div>
                  <Button onClick={() => handleViewProfile(alum.id)} variant="outline" size="sm" className="font-heading shrink-0">View</Button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <Button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} variant="outline" size="sm" className="font-heading">Previous</Button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                <Button key={i} onClick={() => setPage(i)} variant={page === i ? 'default' : 'outline'} size="sm"
                  className={`font-heading ${page === i ? 'bg-accent text-accent-foreground' : ''}`}>{i + 1}</Button>
              ))}
              <Button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} variant="outline" size="sm" className="font-heading">Next</Button>
            </div>
          )}
        </div>
      </section>

      {/* Login Prompt Dialog */}
      <Dialog open={loginPrompt} onOpenChange={setLoginPrompt}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-heading text-center">🔒 Login Required</DialogTitle></DialogHeader>
          <p className="text-center text-muted-foreground font-body">Please login to view full alumni profiles and contact details.</p>
          <div className="flex gap-3 justify-center mt-4">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent-hover font-heading"><Link to="/login">Login</Link></Button>
            <Button asChild variant="outline" className="font-heading"><Link to="/login?tab=signup">Sign Up</Link></Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AlumniDirectoryPage;
