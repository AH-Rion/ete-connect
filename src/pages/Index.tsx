import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ChevronDown, Users, Building2, Globe, Calendar, MapPin, Briefcase, ArrowRight, Quote, Sparkles } from 'lucide-react';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, scaleIn } from '@/lib/animations';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { Button } from '@/components/ui/button';
import { NeuralNetworkBg } from '@/components/NeuralNetworkBg';
import { CubeAlumniShowcase } from '@/components/CubeAlumniShowcase';

// Typewriter hook
const useTypewriter = (phrases: string[], typingSpeed = 50, deletingSpeed = 30, pauseDuration = 2000) => {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentPhrase.substring(0, text.length + 1));
        if (text.length === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        setText(currentPhrase.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return text;
};

// Counter hook
const useCountUp = (target: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return { count, ref };
};

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
  bio: string | null;
  willing_to_mentor: boolean;
}

const HomePage = () => {
  const settings = useSiteSettings();
  const [featured, setFeatured] = useState<Alumni[]>([]);
  const typewriterText = useTypewriter([
    "Where Every Graduate Stays Connected Forever",
    "Bridging Generations of Engineers",
    "Your Network, Your Legacy",
    "From Campus to Career, Together",
  ]);

  useEffect(() => {
    supabase.from('alumni').select('*').eq('is_approved', true).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setFeatured(data); });
  }, []);

  const stats = [
    { icon: Users, target: 250, label: 'Alumni', suffix: '+' },
    { icon: Globe, target: 5, label: 'Countries', suffix: '+' },
    { icon: Building2, target: 30, label: 'Companies', suffix: '+' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#020617' }}>
        <div className="absolute inset-0 opacity-60">
          <NeuralNetworkBg />
        </div>

        {/* Soft radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(79,70,229,0.08) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(2,6,23,1) 30%, transparent 70%)',
          }}
        />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm text-xs font-body font-medium text-white/70 mb-8 tracking-wide"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Department of ETE · CUET
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="font-heading font-semibold tracking-tight"
            style={{ fontFamily: "'Sora', 'Inter', sans-serif" }}
          >
            <span className="block text-5xl sm:text-6xl md:text-7xl text-gradient-hero leading-[1.05]">
              {settings.site_title}
            </span>
            <span className="block mt-3 text-xl sm:text-2xl md:text-3xl text-white/50 font-normal">
              {settings.hero_title}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="h-7 mt-6 mb-8"
          >
            <span className="text-sm md:text-base font-body text-indigo-300/80 tracking-wide">
              {typewriterText}
              <span className="ml-0.5 inline-block w-[2px] h-4 bg-indigo-300/80 align-middle animate-pulse" />
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-lg text-white/55 max-w-2xl mx-auto mb-10 font-body leading-relaxed"
          >
            {settings.hero_subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/alumni">
              <Button className="btn-gradient-primary font-heading text-sm font-medium px-7 h-11 rounded-lg">
                Explore Alumni <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="ghost" className="btn-outline-glow font-heading text-sm font-medium px-7 h-11 rounded-lg">
                Join the Network
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
          >
            <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent" />
            <span className="text-[10px] font-body tracking-[0.2em] uppercase">Scroll</span>
          </motion.div>
        </div>
      </section>

      {/* Companies — refined */}
      <section className="py-12 border-y border-white/[0.06] overflow-hidden" style={{ background: '#020617' }}>
        <div className="container mx-auto px-6">
          <p className="text-center text-[11px] font-body font-medium tracking-[0.2em] uppercase text-white/30 mb-6">
            Our alumni work at
          </p>
          <div className="flex whitespace-nowrap animate-marquee-left opacity-50">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="flex items-center gap-12 px-6 text-base md:text-lg font-heading font-medium text-white/60">
                <span>Google</span><span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Microsoft</span><span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Amazon</span><span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Tesla</span><span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Meta</span><span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Apple</span><span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Samsung</span><span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Goldman Sachs</span><span className="w-1 h-1 rounded-full bg-white/20" />
                <span>NASA</span><span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Grameenphone</span><span className="w-1 h-1 rounded-full bg-white/20" />
                <span>IBM</span><span className="w-1 h-1 rounded-full bg-white/20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 relative overflow-hidden" style={{ background: '#020617' }}>
        <NeuralNetworkBg />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-transparent to-[#020617]/80 pointer-events-none z-[1]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-wrap justify-center gap-8">
            {stats.map((stat, i) => {
              const { count, ref } = useCountUp(stat.target);
              return (
                <motion.div key={i} ref={ref} variants={fadeInUp} className="rounded-2xl px-10 py-8 text-center border border-accent/30 bg-accent/5 backdrop-blur-md hover:border-accent/60 hover:bg-accent/10 transition-all duration-500 min-w-[160px]">
                  <p className="text-5xl md:text-6xl font-heading font-black text-accent">{count}{stat.suffix}</p>
                  <p className="text-foreground/60 font-heading text-sm tracking-widest uppercase mt-2">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <CubeAlumniShowcase />

      {/* How It Works */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">How It Works</h2>
            <p className="text-muted-foreground mt-4 font-body">Three simple steps to join the ETE Family network</p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: '📝', title: 'Register & Fill Your Profile', desc: 'Share your academic and professional journey with us' },
              { icon: '✅', title: 'Get Verified by Admin', desc: 'Our team reviews and approves your submission' },
              { icon: '🌐', title: 'Be Discovered by Students', desc: 'Your profile goes live for students and fellow alumni to find' },
            ].map((step, i) => (
              <motion.div key={i} variants={scaleIn} className="text-center">
                <div className="relative w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl mx-auto mb-4">
                  {step.icon}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: '3s' }} />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      {featured.length > 0 && (
        <section className="py-20" style={{ background: 'linear-gradient(135deg, #020617, #1e1b4b, #020617)' }}>
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">What Our Alumni Say</h2>
            </motion.div>
            <TestimonialsCarousel alumni={featured.filter(a => a.bio)} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b, #4c1d95, #312e81)' }}>
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Are You an ETE Alumni?</h2>
            <p className="text-xl text-white/60 font-body mb-8">Join the Family Today and Reconnect!</p>
            <Link to="/register">
              <Button className="btn-gradient-primary font-heading text-lg px-10 py-6 rounded-full glow-primary shine-effect">
                Register Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-sm text-white/40 mt-4 font-body">It only takes 5 minutes</p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

// Simple testimonials display
const TestimonialsCarousel = ({ alumni }: { alumni: Alumni[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (alumni.length <= 1) return;
    const interval = setInterval(() => setCurrent((p) => (p + 1) % alumni.length), 5000);
    return () => clearInterval(interval);
  }, [alumni.length]);

  if (!alumni.length) return null;
  const alum = alumni[current];

  return (
    <div className="max-w-3xl mx-auto text-center">
      <Quote className="w-12 h-12 text-primary/50 mx-auto mb-6" />
      <motion.p
        key={current}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-xl italic text-white/70 font-body mb-8 leading-relaxed"
      >
        "{alum.bio}"
      </motion.p>
      <div className="flex items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-heading font-bold">
          {alum.full_name.charAt(0)}
        </div>
        <div className="text-left">
          <p className="font-heading font-semibold text-white">{alum.full_name}</p>
          <p className="text-sm text-white/50 font-body">Batch {alum.graduation_year} · {alum.company}</p>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {alumni.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-primary w-6' : 'bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
