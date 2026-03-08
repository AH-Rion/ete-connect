import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, ChevronDown, Users, Building2, Globe, Calendar, MapPin, Briefcase, ArrowRight, Quote } from 'lucide-react';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, scaleIn } from '@/lib/animations';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

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
    let start = 0;
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
  const [featured, setFeatured] = useState<Alumni[]>([]);
  const typewriterText = useTypewriter([
    "Where Every Graduate Stays Connected Forever",
    "Bridging Generations of Engineers",
    "Your Network, Your Legacy",
    "From Campus to Career, Together",
  ]);

  useEffect(() => {
    supabase.from('alumni').select('*').eq('is_approved', true).eq('is_featured', true).limit(6)
      .then(({ data }) => { if (data) setFeatured(data); });
  }, []);

  const stats = [
    { icon: GraduationCap, target: 500, label: 'Alumni Registered', suffix: '+' },
    { icon: Building2, target: 200, label: 'Companies Represented', suffix: '+' },
    { icon: Globe, target: 30, label: 'Countries Reached', suffix: '+' },
    { icon: Calendar, target: 25, label: 'Years of Legacy', suffix: '+' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
        {/* Particle dots */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-text-on-dark/30"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ x: [0, (Math.random() - 0.5) * 100], y: [0, (Math.random() - 0.5) * 100] }}
              transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, repeatType: "reverse" }}
            />
          ))}
        </div>

        {/* Gradient blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-heading mb-6"
          >
            🎓 Department of ETE, CUET
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-4">
            <span className="block text-2xl md:text-3xl text-text-on-dark/80 font-heading">Welcome to</span>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-heading font-black text-gradient-gold mt-2">ETE Family</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="h-8 mb-6"
          >
            <span className="text-lg md:text-xl text-accent font-heading">{typewriterText}<span className="animate-pulse">|</span></span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-lg text-text-on-dark/70 max-w-2xl mx-auto mb-10 font-body"
          >
            Discover where our alumni are now — their journeys, achievements, and how to connect with them. Join the largest ETE alumni network.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/alumni">
              <Button className="bg-accent text-accent-foreground hover:bg-accent-hover font-heading text-lg px-8 py-6 rounded-full gold-glow shine-effect">
                Explore Alumni <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground font-heading text-lg px-8 py-6 rounded-full">
                Join the Family
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-text-on-dark/50 flex flex-col items-center gap-2"
          >
            <span className="text-sm font-body">Scroll to explore</span>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-6 bg-bg-dark border-y border-accent/20 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee-left">
          {[...Array(2)].map((_, j) => (
            <span key={j} className="text-xl font-heading font-semibold text-text-on-dark/40 mx-4">
              Our Alumni Work At: Google <span className="text-accent mx-3">•</span> Microsoft <span className="text-accent mx-3">•</span> Amazon <span className="text-accent mx-3">•</span> Tesla <span className="text-accent mx-3">•</span> SpaceX <span className="text-accent mx-3">•</span> Goldman Sachs <span className="text-accent mx-3">•</span> Meta <span className="text-accent mx-3">•</span> Apple <span className="text-accent mx-3">•</span> Samsung <span className="text-accent mx-3">•</span> Huawei <span className="text-accent mx-3">•</span> Grameenphone <span className="text-accent mx-3">•</span> NASA <span className="text-accent mx-3">•</span> IBM <span className="text-accent mx-3">•</span>
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-bg-dark relative">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 49px, hsl(220 20% 50%) 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, hsl(220 20% 50%) 50px)', backgroundSize: '50px 50px' }} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const { count, ref } = useCountUp(stat.target);
              return (
                <motion.div key={i} ref={ref} variants={fadeInUp} className="glass rounded-xl p-6 text-center">
                  <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15, type: 'spring' }}>
                    <stat.icon className="w-10 h-10 text-accent mx-auto mb-3" />
                  </motion.div>
                  <p className="text-4xl md:text-5xl font-heading font-bold text-accent">{count}{stat.suffix}</p>
                  <p className="text-text-on-dark/60 font-body mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Alumni */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Our Distinguished Alumni</h2>
            <div className="w-24 h-1 bg-accent mx-auto mt-4 rounded-full" />
            <p className="text-muted-foreground mt-4 font-body">Meet some of the incredible people from our ETE family</p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((alum, i) => (
              <motion.div key={alum.id} variants={fadeInUp} className="group perspective-1000">
                <div className="relative h-[350px] rounded-xl overflow-hidden shadow-md card-hover bg-card">
                  {/* Front */}
                  <div className="absolute inset-0 gradient-hero flex flex-col items-center justify-center text-center p-6 backface-hidden group-hover:[transform:rotateY(180deg)] transition-transform duration-700" style={{ backfaceVisibility: 'hidden' }}>
                    <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-2xl font-heading font-bold text-accent-foreground mb-4 ring-4 ring-accent/30">
                      {alum.full_name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-heading font-bold text-text-on-dark">{alum.full_name}</h3>
                    <span className="inline-block mt-2 px-3 py-1 text-xs font-heading bg-accent/20 text-accent rounded-full">
                      Batch {alum.graduation_year}
                    </span>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 bg-card flex flex-col items-center justify-center text-center p-6 [transform:rotateY(180deg)] group-hover:[transform:rotateY(0deg)] transition-transform duration-700 border-t-4 border-accent" style={{ backfaceVisibility: 'hidden' }}>
                    <h3 className="text-lg font-heading font-bold text-foreground">{alum.job_title}</h3>
                    <p className="text-muted-foreground font-body">{alum.company}</p>
                    {alum.industry && <span className="inline-block mt-2 px-3 py-1 text-xs font-heading bg-primary/10 text-primary rounded-full">{alum.industry}</span>}
                    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1"><MapPin className="w-3 h-3" />{alum.city}, {alum.country}</p>
                    <Link to={`/alumni/${alum.id}`} className="mt-4 text-sm font-heading font-semibold text-accent hover:text-accent-hover transition-colors flex items-center gap-1">
                      View Profile <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
                <div className="relative w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-3xl mx-auto mb-4">
                  {step.icon}
                  <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping" style={{ animationDuration: '3s' }} />
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
        <section className="py-20 gradient-hero">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-on-dark">What Our Alumni Say</h2>
            </motion.div>
            <TestimonialsCarousel alumni={featured.filter(a => a.bio)} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 gradient-cta relative overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-on-dark mb-4">Are You an ETE Alumni?</h2>
            <p className="text-xl text-text-on-dark/70 font-body mb-8">Join the Family Today and Reconnect!</p>
            <Link to="/register">
              <Button className="bg-accent text-accent-foreground hover:bg-accent-hover font-heading text-lg px-10 py-6 rounded-full gold-glow shine-effect">
                Register Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-sm text-text-on-dark/50 mt-4 font-body">It only takes 5 minutes</p>
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
      <Quote className="w-12 h-12 text-accent/50 mx-auto mb-6" />
      <motion.p
        key={current}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-xl italic text-text-on-dark/80 font-body mb-8 leading-relaxed"
      >
        "{alum.bio}"
      </motion.p>
      <div className="flex items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-heading font-bold">
          {alum.full_name.charAt(0)}
        </div>
        <div className="text-left">
          <p className="font-heading font-semibold text-text-on-dark">{alum.full_name}</p>
          <p className="text-sm text-text-on-dark/60 font-body">Batch {alum.graduation_year} · {alum.company}</p>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {alumni.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-accent w-6' : 'bg-text-on-dark/30'}`} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
