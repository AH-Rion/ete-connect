import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Briefcase, GraduationCap, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

interface Alumni {
  id: string;
  full_name: string;
  graduation_year: number | null;
  job_title: string | null;
  company: string | null;
  photo_url: string | null;
}

const CARDS_PER_PAGE = 6;
const ROTATION_INTERVAL = 3000;

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

const cardVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 50,
    scale: 0.85,
    rotateX: 20,
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
    y: -40,
    scale: 0.9,
    rotateX: -15,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
    },
  }),
};

// ─── Grid Rotation (Desktop/Tablet) ───
const AlumniGrid = ({ alumni, isPaused }: { alumni: Alumni[]; isPaused: boolean }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(alumni.length / CARDS_PER_PAGE);

  useEffect(() => {
    if (totalPages <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [totalPages, isPaused]);

  const displayed = alumni.slice(
    currentPage * CARDS_PER_PAGE,
    (currentPage + 1) * CARDS_PER_PAGE
  );

  if (!alumni.length) return null;

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayed.map((alum, i) => (
            <motion.div
              key={alum.id}
              custom={i}
              variants={cardVariants}
              style={{ perspective: '800px' }}
            >
              <CubeCard alumni={alum} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

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
    </div>
  );
};

// ─── Single Card ───
const CubeCard = ({ alumni }: { alumni: Alumni }) => (
  <div
    className="w-[300px] h-[380px] rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_50px_-10px_hsl(var(--primary)/0.5)] hover:scale-[1.04] group"
    style={{
      background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
    }}
  >
    {/* Spotlight glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent 70%)' }} />

    {/* Top bar */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-60 group-hover:opacity-100 transition-opacity" />

    {/* Avatar */}
    <div className="relative mb-5">
      <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-60 blur-md transition-opacity duration-500" />
      <Avatar className="w-24 h-24 relative ring-2 ring-white/15 group-hover:ring-primary/50 transition-all duration-500">
        {alumni.photo_url ? (
          <AvatarImage src={alumni.photo_url} alt={alumni.full_name} className="object-cover" />
        ) : null}
        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-heading font-bold text-2xl">
          {getInitials(alumni.full_name)}
        </AvatarFallback>
      </Avatar>
    </div>

    {/* Info */}
    <h3 className="text-xl font-heading font-bold text-white mb-1 group-hover:text-primary transition-colors duration-300 truncate max-w-full">
      {alumni.full_name}
    </h3>

    {alumni.graduation_year && (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-heading bg-accent/15 text-accent border border-accent/20 mb-3">
        <GraduationCap className="w-3 h-3" />
        Batch {alumni.graduation_year}
      </span>
    )}

    {alumni.job_title && (
      <p className="flex items-center gap-1.5 text-sm text-white/60 mb-1">
        <Briefcase className="w-3.5 h-3.5 text-primary/70" />
        {alumni.job_title}
      </p>
    )}
    {alumni.company && (
      <p className="text-sm text-white/50 mb-4">🏢 {alumni.company}</p>
    )}

    <Link
      to={`/alumni/${alumni.id}`}
      className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-heading font-semibold bg-white/5 border border-white/10 text-white/70 hover:bg-primary/20 hover:border-primary/40 hover:text-white transition-all duration-300 group/btn"
    >
      View Profile
      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
    </Link>
  </div>
);

// ─── Mobile Carousel ───
const MobileCarousel = ({ alumni }: { alumni: Alumni[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (alumni.length <= 1) return;
    const interval = setInterval(() => setCurrent((p) => (p + 1) % alumni.length), ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [alumni.length]);

  if (!alumni.length) return null;

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={alumni[current].id}
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -60, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <CubeCard alumni={alumni[current]} />
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-1.5 mt-6">
        {alumni.slice(0, Math.min(alumni.length, 10)).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-400 ${i === current ? 'w-8 h-2.5 bg-gradient-to-r from-primary to-secondary' : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Main Export ───
export const CubeAlumniShowcase = () => {
  const [allAlumni, setAllAlumni] = useState<Alumni[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    supabase
      .from('alumni')
      .select('id, full_name, graduation_year, job_title, company, photo_url')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setAllAlumni(data); });
  }, []);

  if (!allAlumni.length) return null;

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #020617 0%, #0f0a2e 30%, #1a1145 50%, #0f0a2e 70%, #020617 100%)' }}>
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[150px] animate-float" style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[130px] animate-float" style={{ background: 'radial-gradient(circle, hsl(var(--secondary)), transparent 70%)', animationDelay: '3s' }} />
        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm text-sm font-heading text-primary-foreground/80 mb-6"
          >
            <Eye className="w-4 h-4 text-accent" />
            3D Alumni Showcase
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

        {/* Cube / Carousel */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative min-h-[440px] flex items-center justify-center"
        >
          {isMobile ? (
            <MobileCarousel alumni={allAlumni} />
          ) : (
            <AlumniGrid alumni={allAlumni} isPaused={isPaused} />
          )}
        </div>

        {/* View all */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-14">
          <Link to="/alumni" className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-primary hover:text-secondary transition-colors duration-300">
            View All Alumni <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
