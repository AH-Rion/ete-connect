import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Users, Building2, Globe, ArrowRight, Sparkles, Network, GraduationCap, TrendingUp } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/animations';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const useCountUp = (target: number, duration = 1800) => {
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
  photo_url: string | null;
  bio: string | null;
}

const SectionLabel = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <div className={`section-label ${dark ? 'section-label-dark' : ''}`}>
    <span className="dot" />
    {children}
  </div>
);

const HomePage = () => {
  const settings = useSiteSettings();
  const [featured, setFeatured] = useState<Alumni[]>([]);

  useEffect(() => {
    supabase.from('alumni').select('*').eq('is_approved', true).order('created_at', { ascending: false }).limit(6)
      .then(({ data }) => { if (data) setFeatured(data); });
  }, []);

  const stats = [
    { target: 250, label: 'Alumni Network', suffix: '+' },
    { target: 5, label: 'Countries', suffix: '+' },
    { target: 30, label: 'Companies', suffix: '+' },
    { target: 12, label: 'Years Strong', suffix: '' },
  ];

  return (
    <div style={{ background: '#FAFAFA' }}>
      {/* HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(0,82,255,0.08), transparent 60%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(77,124,255,0.06), transparent 60%)',
          }}
        />
        <div className="max-w-[72rem] mx-auto px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <SectionLabel>Alumni Network · CUET ETE</SectionLabel>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-6"
                style={{
                  fontFamily: "'Calistoga', Georgia, serif",
                  fontSize: 'clamp(2.6rem, 5vw, 5rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  color: '#0F172A',
                }}
              >
                Where every graduate{' '}
                <span className="text-gradient">stays connected</span> forever.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-6 max-w-xl"
                style={{ fontSize: '1.125rem', lineHeight: 1.75, color: '#64748B' }}
              >
                {settings.hero_subtitle || 'The official alumni network of ETE, CUET — bridging generations of engineers across companies, continents, and careers.'}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link to="/alumni" className="btn-primary-grad">
                  Explore Alumni <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/register" className="btn-secondary-outline">
                  Join the Network
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-10 flex items-center gap-3"
              >
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white"
                      style={{
                        background: `linear-gradient(135deg, hsl(${(i * 60 + 200) % 360}, 70%, 55%), hsl(${(i * 60 + 240) % 360}, 70%, 65%))`,
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: '#0F172A' }}>Joined by 500+ graduates</p>
                  <p className="text-[12px]" style={{ color: '#64748B' }}>Across 30+ companies worldwide</p>
                </div>
              </motion.div>
            </div>

            {/* Right — abstract graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative h-[480px] hidden lg:block"
            >
              {/* Rotating dashed rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="absolute w-[420px] h-[420px] rounded-full animate-spin-slow"
                  style={{ border: '1.5px dashed rgba(0,82,255,0.18)' }}
                />
                <div
                  className="absolute w-[300px] h-[300px] rounded-full animate-spin-slower"
                  style={{ border: '1.5px dashed rgba(77,124,255,0.22)' }}
                />
              </div>

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="icon-box-gradient w-24 h-24">
                  <Network className="w-12 h-12" />
                </div>
              </div>

              {/* Floating stat cards */}
              <motion.div
                className="absolute top-6 right-2 card-premium px-4 py-3 flex items-center gap-3 animate-float"
                style={{ animationDelay: '0s' }}
              >
                <div className="icon-box-gradient w-9 h-9"><GraduationCap className="w-4 h-4" /></div>
                <div>
                  <p className="text-[18px] font-semibold leading-none" style={{ color: '#0F172A', fontFamily: "'Calistoga', serif" }}>250+</p>
                  <p className="text-[11px] font-mono-label" style={{ color: '#64748B' }}>Alumni</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-12 left-0 card-premium px-4 py-3 flex items-center gap-3 animate-float"
                style={{ animationDelay: '1.5s' }}
              >
                <div className="icon-box-gradient w-9 h-9"><Globe className="w-4 h-4" /></div>
                <div>
                  <p className="text-[18px] font-semibold leading-none" style={{ color: '#0F172A', fontFamily: "'Calistoga', serif" }}>5+</p>
                  <p className="text-[11px] font-mono-label" style={{ color: '#64748B' }}>Countries</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-2 card-premium px-4 py-3 flex items-center gap-3 animate-float"
                style={{ animationDelay: '3s' }}
              >
                <div className="icon-box-gradient w-9 h-9"><TrendingUp className="w-4 h-4" /></div>
                <div>
                  <p className="text-[18px] font-semibold leading-none" style={{ color: '#0F172A', fontFamily: "'Calistoga', serif" }}>30+</p>
                  <p className="text-[11px] font-mono-label" style={{ color: '#64748B' }}>Companies</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* COMPANIES MARQUEE */}
      <section className="py-12 border-y" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-[72rem] mx-auto px-8 overflow-hidden">
          <p className="text-center font-mono-label mb-6" style={{ color: '#64748B' }}>
            Our alumni work at
          </p>
          <div className="flex whitespace-nowrap animate-marquee-left" style={{ opacity: 0.85 }}>
            {[...Array(2)].map((_, j) => (
              <div key={j} className="flex items-center gap-12 px-6 text-base font-medium" style={{ color: '#94A3B8' }}>
                {['Google', 'Microsoft', 'Amazon', 'Tesla', 'Meta', 'Apple', 'Samsung', 'Goldman Sachs', 'NASA', 'Grameenphone', 'IBM'].map((c, i) => (
                  <span key={i} className="flex items-center gap-12">
                    {c}<span className="w-1 h-1 rounded-full" style={{ background: '#CBD5E1' }} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS — DARK INVERTED */}
      <section className="relative overflow-hidden" style={{ background: '#0F172A', padding: '100px 2rem' }}>
        <div className="dot-texture absolute inset-0 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,82,255,0.18), transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(77,124,255,0.15), transparent 70%)', filter: 'blur(80px)' }} />

        <div className="max-w-[72rem] mx-auto relative">
          <div className="text-center mb-16">
            <SectionLabel dark>By the numbers</SectionLabel>
            <h2
              className="mt-6"
              style={{
                fontFamily: "'Calistoga', serif",
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                lineHeight: 1.1,
                color: '#fff',
              }}
            >
              A network <span className="text-gradient">growing every year</span>.
            </h2>
            <p className="mt-4 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.05rem' }}>
              Our community spans continents, industries, and decades — united by ETE, CUET.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4"
          >
            {stats.map((stat, i) => {
              const { count, ref } = useCountUp(stat.target);
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  variants={fadeInUp}
                  className="text-center px-6 py-8"
                  style={{ borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
                >
                  <p
                    className="text-gradient"
                    style={{ fontFamily: "'Calistoga', serif", fontSize: 'clamp(2.5rem, 4vw, 4rem)', lineHeight: 1 }}
                  >
                    {count}{stat.suffix}
                  </p>
                  <p className="font-mono-label mt-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 2rem', background: '#FAFAFA' }}>
        <div className="max-w-[72rem] mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="mt-6" style={{ fontFamily: "'Calistoga', serif", fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: 1.1, color: '#0F172A' }}>
              Three steps to <span className="text-gradient">join the family</span>.
            </h2>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Register & build your profile', desc: 'Share your academic and professional journey — graduation year, role, location, and more.' },
              { num: '02', title: 'Get verified', desc: 'Our admin team reviews and approves your submission to keep the directory authentic.' },
              { num: '03', title: 'Be discovered', desc: 'Your profile goes live for students and fellow alumni to find, connect, and collaborate with.' },
            ].map((step, i) => (
              <motion.div key={i} variants={scaleIn} className={`card-premium p-7 ${i === 1 ? 'card-gradient-border' : ''}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-box-gradient w-10 h-10 text-[14px] font-mono-label" style={{ fontWeight: 600 }}>
                    {step.num}
                  </div>
                  <Sparkles className="w-4 h-4" style={{ color: '#0052FF' }} />
                </div>
                <h3 className="text-[20px] font-semibold mb-2" style={{ color: '#0F172A' }}>{step.title}</h3>
                <p className="text-[15px]" style={{ color: '#64748B', lineHeight: 1.7 }}>{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURED ALUMNI */}
      {featured.length > 0 && (
        <section style={{ padding: '100px 2rem', background: '#fff', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
          <div className="max-w-[72rem] mx-auto">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <SectionLabel>Featured alumni</SectionLabel>
                <h2 className="mt-6" style={{ fontFamily: "'Calistoga', serif", fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#0F172A', lineHeight: 1.1 }}>
                  Meet our <span className="text-gradient">community</span>.
                </h2>
              </div>
              <Link to="/alumni" className="btn-secondary-outline text-[14px]" style={{ height: '40px' }}>
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.slice(0, 6).map((alum) => (
                <Link key={alum.id} to={`/alumni/${alum.id}`} className="card-premium p-6 block">
                  <div className="flex items-center gap-4 mb-4">
                    {alum.photo_url ? (
                      <img src={alum.photo_url} alt={alum.full_name} className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                      <div className="icon-box-gradient w-14 h-14 rounded-full text-[18px] font-semibold" style={{ fontFamily: "'Calistoga', serif" }}>
                        {alum.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-[16px]" style={{ color: '#0F172A' }}>{alum.full_name}</p>
                      <p className="text-[13px]" style={{ color: '#64748B' }}>Batch {alum.graduation_year}</p>
                    </div>
                  </div>
                  {(alum.job_title || alum.company) && (
                    <p className="text-[14px]" style={{ color: '#64748B', lineHeight: 1.6 }}>
                      {alum.job_title}{alum.job_title && alum.company ? ' · ' : ''}{alum.company}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA — DARK */}
      <section className="relative overflow-hidden" style={{ background: '#0F172A', padding: '100px 2rem' }}>
        <div className="dot-texture absolute inset-0 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,82,255,0.18), transparent 70%)', filter: 'blur(80px)' }} />

        <div className="max-w-[48rem] mx-auto relative text-center">
          <SectionLabel dark>Join the network</SectionLabel>
          <h2
            className="mt-6"
            style={{ fontFamily: "'Calistoga', serif", fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', lineHeight: 1.1, color: '#fff' }}
          >
            Are you an <span className="text-gradient">ETE alumni?</span>
          </h2>
          <p className="mt-5 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Reconnect with classmates, mentor the next generation, and stay part of the family — wherever your career takes you.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-xl mx-auto">
            <div
              className="flex items-center flex-1"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '14px',
                padding: '6px',
              }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent outline-none px-4 text-[14px]"
                style={{ color: '#fff' }}
              />
              <Link to="/register" className="btn-primary-grad text-[14px]" style={{ height: '40px' }}>
                Register <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <p className="mt-4 text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>It only takes 5 minutes.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
