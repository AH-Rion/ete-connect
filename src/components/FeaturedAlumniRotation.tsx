import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Briefcase, GraduationCap, MapPin, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
}

const ALUMNI_PER_PAGE = 6;
const ROTATION_INTERVAL = 6000;

const cardVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 40,
    scale: 0.9,
    rotateX: 15,
    transition: { delay: i * 0.08 },
  }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: -30,
    scale: 0.95,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
    },
  }),
};

export const FeaturedAlumniRotation = () => {
  const [allAlumni, setAllAlumni] = useState<Alumni[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from('alumni')
      .select('id, full_name, graduation_year, job_title, company, city, country, industry, photo_url')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setAllAlumni(data);
      });
  }, []);

  const totalPages = Math.ceil(allAlumni.length / ALUMNI_PER_PAGE);
  const displayedAlumni = allAlumni.slice(
    currentPage * ALUMNI_PER_PAGE,
    (currentPage + 1) * ALUMNI_PER_PAGE
  );

  useEffect(() => {
    if (totalPages <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [totalPages, isPaused]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  if (!allAlumni.length) return null;

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #020617 0%, #0f0a2e 30%, #1a1145 50%, #0f0a2e 70%, #020617 100%)' }}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-[150px] animate-float" style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-[130px] animate-float" style={{ background: 'radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)', animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10 blur-[200px]" style={{ background: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 60%)' }} />
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm text-sm font-heading text-primary-foreground/80 mb-6"
          >
            <Eye className="w-4 h-4 text-accent" />
            Featured Profiles
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-4">
            Our Distinguished{' '}
            <span className="text-gradient-hero">Alumni</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full mb-4" />
          <p className="text-lg text-white/50 font-body max-w-2xl mx-auto">
            Meet the incredible people from our ETE family making waves across the globe
          </p>
        </motion.div>

        {/* Alumni grid */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayedAlumni.map((alum, i) => (
                <motion.div
                  key={alum.id}
                  custom={i}
                  variants={cardVariants}
                  className="group relative"
                  style={{ perspective: '1000px' }}
                >
                  <div
                    className="relative rounded-2xl overflow-hidden backdrop-blur-xl border border-white/10 transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    }}
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.15) 0%, transparent 70%)' }} />

                    {/* Top gradient bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent opacity-60 group-hover:opacity-100 transition-opacity" />

                    <div className="p-6">
                      {/* Avatar + Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative">
                          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-70 blur-sm transition-opacity duration-500" />
                          <Avatar className="w-16 h-16 relative ring-2 ring-white/10 group-hover:ring-primary/50 transition-all duration-500 group-hover:scale-110">
                            {alum.photo_url ? (
                              <AvatarImage src={alum.photo_url} alt={alum.full_name} className="object-cover" />
                            ) : null}
                            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-heading font-bold text-lg">
                              {getInitials(alum.full_name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-heading font-bold text-white truncate group-hover:text-primary transition-colors duration-300">
                            {alum.full_name}
                          </h3>
                          {alum.graduation_year && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-heading bg-accent/15 text-accent border border-accent/20">
                              <GraduationCap className="w-3 h-3" />
                              Batch {alum.graduation_year}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Job info */}
                      <div className="space-y-2 mb-5">
                        {alum.job_title && (
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Briefcase className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                            <span className="truncate">{alum.job_title}</span>
                          </div>
                        )}
                        {alum.company && (
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <span className="w-3.5 h-3.5 flex items-center justify-center text-secondary/70 shrink-0 text-xs">🏢</span>
                            <span className="truncate">{alum.company}</span>
                          </div>
                        )}
                        {(alum.city || alum.country) && (
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <MapPin className="w-3.5 h-3.5 text-accent/70 shrink-0" />
                            <span className="truncate">
                              {[alum.city, alum.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* View Profile button */}
                      <Link
                        to={`/alumni/${alum.id}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-heading font-semibold bg-white/5 border border-white/10 text-white/70 hover:bg-primary/20 hover:border-primary/40 hover:text-white transition-all duration-300 group/btn"
                      >
                        View Profile
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination dots */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`rounded-full transition-all duration-500 ${
                  i === currentPage
                    ? 'w-10 h-3 bg-gradient-to-r from-primary to-secondary shadow-[0_0_12px_hsl(var(--primary)/0.5)]'
                    : 'w-3 h-3 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/alumni"
            className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-primary hover:text-secondary transition-colors duration-300"
          >
            View All Alumni
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
