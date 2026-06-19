import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Briefcase, Mail, Phone, Linkedin, Globe, GraduationCap,
  Copy, Check, ExternalLink, ArrowLeft, Star, Calendar, Hash, Home,
  Share2, Lock, Building2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { fadeInUp, pageTransition } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface AlumniProfile {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  gender: string | null;
  city: string | null;
  country: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  department: string | null;
  degree: string | null;
  graduation_year: number | null;
  student_id: string | null;
  hall_of_residence: string | null;
  university_memory: string | null;
  employment_status: string | null;
  job_title: string | null;
  company: string | null;
  industry: string | null;
  years_of_experience: number;
  skills: string | null;
  willing_to_mentor: boolean;
  bio: string | null;
}

interface Education {
  id: string; degree: string; institution: string; year: number | null;
}
interface Employment {
  id: string; company: string; position: string; location: string | null;
  start_date: string | null; end_date: string | null; is_current: boolean;
}

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '';

const setMeta = (name: string, content: string) => {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const AlumniProfilePage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [alumni, setAlumni] = useState<AlumniProfile | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [employment, setEmployment] = useState<Employment[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase
        .from('alumni').select('*').eq('id', id).eq('is_approved', true).single();
      if (!error && data) {
        setAlumni(data as AlumniProfile);
        if (data.user_id) {
          const [eduRes, empRes] = await Promise.all([
            supabase.from('education').select('*').eq('user_id', data.user_id).order('year', { ascending: false }),
            supabase.from('employment').select('*').eq('user_id', data.user_id).order('is_current', { ascending: false }).order('start_date', { ascending: false }),
          ]);
          setEducation((eduRes.data as Education[]) || []);
          setEmployment((empRes.data as Employment[]) || []);
        }
      }
      setLoading(false);
    })();
  }, [id]);

  // SEO
  useEffect(() => {
    if (!alumni) return;
    const title = `${alumni.full_name} — ETE Alumni, CUET`;
    document.title = title;
    const desc = [
      alumni.job_title,
      alumni.company && `at ${alumni.company}`,
      alumni.graduation_year && `· ETE Batch ${alumni.graduation_year}`,
      alumni.city && `· ${alumni.city}`,
    ].filter(Boolean).join(' ').slice(0, 158);
    setMeta('description', desc || `${alumni.full_name}, ETE alumni of CUET.`);
    // canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = window.location.href;
  }, [alumni]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copied!');
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) return <LoadingSpinner />;
  if (!alumni) return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <GraduationCap className="w-16 h-16 text-muted-foreground/40 mx-auto" aria-hidden="true" />
        <h1 className="text-2xl font-heading font-bold text-foreground">Alumni Profile Not Found</h1>
        <Link to="/alumni"><Button variant="outline" className="font-heading"><ArrowLeft className="w-4 h-4 mr-2" />Back to Directory</Button></Link>
      </div>
    </div>
  );

  const skills = alumni.skills?.split(',').map(s => s.trim()).filter(Boolean) || [];

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: alumni.full_name,
    jobTitle: alumni.job_title || undefined,
    worksFor: alumni.company ? { '@type': 'Organization', name: alumni.company } : undefined,
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Chittagong University of Engineering & Technology (CUET) — ETE',
    },
    address: alumni.city ? { '@type': 'PostalAddress', addressLocality: alumni.city, addressCountry: alumni.country } : undefined,
    image: alumni.photo_url || undefined,
  };

  return (
    <motion.article {...pageTransition} className="pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Header */}
      <header className="py-16 relative overflow-hidden" style={{ background: '#0F172A' }}>
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            {alumni.photo_url ? (
              <img src={alumni.photo_url} alt={`Portrait of ${alumni.full_name}`} className="w-28 h-28 rounded-full object-cover mx-auto mb-4 ring-4 ring-accent/30" />
            ) : (
              <div className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-heading font-bold text-white mx-auto mb-4" aria-hidden="true" style={{ background: 'linear-gradient(135deg, #0052FF, #4D7CFF)', boxShadow: '0 0 0 4px rgba(0,82,255,0.2)' }}>
                {alumni.full_name.charAt(0)}
              </div>
            )}
            <h1 className="text-3xl font-heading font-bold text-white">{alumni.full_name}</h1>
            <p className="text-xl font-body mt-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{alumni.job_title} {alumni.company && `@ ${alumni.company}`}</p>
            {alumni.city && <p className="font-body flex items-center justify-center gap-1 mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}><MapPin className="w-4 h-4" aria-hidden="true" />{alumni.city}, {alumni.country}</p>}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {alumni.graduation_year && <Badge className="font-heading" style={{ background: 'rgba(0,82,255,0.2)', color: '#7DA3FF' }}>Batch {alumni.graduation_year}</Badge>}
              {alumni.industry && <Badge className="font-heading" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>{alumni.industry}</Badge>}
              {alumni.willing_to_mentor && <Badge className="font-heading" style={{ background: 'rgba(0,82,255,0.2)', color: '#7DA3FF' }}><Star className="w-3 h-3 mr-1" aria-hidden="true" />Available for Mentoring</Badge>}
            </div>
            <div className="flex gap-3 justify-center mt-6 flex-wrap">
              {isAuthenticated ? (
                <Button asChild className="font-heading text-white" style={{ background: 'linear-gradient(135deg, #0052FF, #4D7CFF)' }}>
                  <a href={`mailto:${alumni.email}`}><Mail className="w-4 h-4 mr-2" />Connect via Email</a>
                </Button>
              ) : (
                <Button asChild variant="outline" className="font-heading text-white border-white/30 hover:bg-white/10">
                  <Link to={`/login?redirect=/alumni/${alumni.id}`}><Lock className="w-4 h-4 mr-2" />Login to see contact info</Link>
                </Button>
              )}
              <Button className="font-heading text-white" style={{ background: 'linear-gradient(135deg, #0052FF, #4D7CFF)' }}
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
                <Share2 className="w-4 h-4 mr-1" /> Share Profile
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <section className="bg-background py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              {alumni.bio && (
                <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-xl p-6 shadow-sm">
                  <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2"><span className="text-3xl text-accent" aria-hidden="true">"</span> About</h2>
                  <p className="text-muted-foreground font-body italic leading-relaxed">{alumni.bio}</p>
                </motion.section>
              )}

              {/* Employment timeline */}
              <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-accent" aria-hidden="true" /> Professional Experience</h2>
                {employment.length === 0 ? (
                  <div className="space-y-1">
                    {alumni.employment_status && <Badge className="bg-success/10 text-success">{alumni.employment_status}</Badge>}
                    {alumni.job_title && <p className="font-body"><span className="font-semibold">{alumni.job_title}</span>{alumni.company && <> at <span className="font-semibold">{alumni.company}</span></>}</p>}
                    <p className="text-sm text-muted-foreground font-body">{alumni.years_of_experience} years of experience</p>
                  </div>
                ) : (
                  <ol className="border-l-2 border-accent/30 pl-4 space-y-4">
                    {employment.map(e => (
                      <li key={e.id} className="relative">
                        <span className="absolute -left-[1.35rem] top-1.5 w-2.5 h-2.5 rounded-full bg-accent" aria-hidden="true" />
                        <p className="font-heading font-semibold text-foreground">{e.position}</p>
                        <p className="text-sm text-muted-foreground font-body flex items-center gap-1"><Building2 className="w-3.5 h-3.5" aria-hidden="true" />{e.company}</p>
                        <p className="text-xs text-muted-foreground/80 font-body">
                          {fmt(e.start_date) || '—'} – {e.is_current ? 'Present' : fmt(e.end_date) || '—'}
                          {e.location && <span className="ml-2 inline-flex items-center gap-1"><MapPin className="w-3 h-3" aria-hidden="true" />{e.location}</span>}
                        </p>
                      </li>
                    ))}
                  </ol>
                )}
                {skills.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-heading font-semibold text-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((s, i) => <Badge key={i} variant="outline" className="text-xs hover:scale-105 transition-transform">{s}</Badge>)}
                    </div>
                  </div>
                )}
              </motion.section>

              {/* Education */}
              <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-accent" aria-hidden="true" /> Education</h2>
                {education.length === 0 ? (
                  <div className="space-y-1 text-sm font-body text-muted-foreground">
                    <p><span className="font-semibold text-foreground">{alumni.degree || 'BSc'}</span> · {alumni.department || 'ETE'}</p>
                    {alumni.graduation_year && <p>Graduated {alumni.graduation_year}</p>}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {education.map(e => (
                      <li key={e.id}>
                        <p className="font-heading font-semibold text-foreground">{e.degree}</p>
                        <p className="text-sm text-muted-foreground font-body">{e.institution}{e.year ? ` · ${e.year}` : ''}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.section>

              {alumni.university_memory && (
                <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-xl p-6 shadow-sm">
                  <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-accent" aria-hidden="true" /> University Memory</h2>
                  <p className="text-muted-foreground font-body italic">"{alumni.university_memory}"</p>
                  {alumni.graduation_year && <p className="text-sm text-accent font-heading mt-2">— Batch of {alumni.graduation_year}</p>}
                </motion.section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-xl p-6 shadow-sm glass">
                <h3 className="font-heading font-semibold text-foreground mb-4">Contact Information</h3>
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-body text-muted-foreground min-w-0">
                        <Mail className="w-4 h-4 shrink-0 text-accent" aria-hidden="true" />
                        <a href={`mailto:${alumni.email}`} className="truncate hover:text-accent">{alumni.email}</a>
                      </div>
                      <button onClick={() => copyToClipboard(alumni.email, 'email')} className="text-muted-foreground hover:text-accent shrink-0" aria-label="Copy email">
                        {copiedField === 'email' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    {alumni.phone && (
                      <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                        <Phone className="w-4 h-4 shrink-0 text-accent" aria-hidden="true" />
                        <a href={`tel:${alumni.phone}`} className="hover:text-accent">{alumni.phone}</a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                      <Lock className="w-4 h-4 text-accent" aria-hidden="true" />
                      <span>Email & phone visible to members only</span>
                    </div>
                    <Button asChild size="sm" variant="outline" className="w-full font-heading">
                      <Link to={`/login?redirect=/alumni/${alumni.id}`}>Login to view contact info</Link>
                    </Button>
                  </div>
                )}
                <div className="space-y-2 mt-4">
                  {alumni.linkedin_url && (
                    <a href={alumni.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-body text-accent hover:text-accent-hover">
                      <Linkedin className="w-4 h-4" aria-hidden="true" /> View LinkedIn <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  )}
                  {alumni.website_url && (
                    <a href={alumni.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-body text-accent hover:text-accent-hover">
                      <Globe className="w-4 h-4" aria-hidden="true" /> Visit Website <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-xl p-6 shadow-sm">
                <h3 className="font-heading font-semibold text-foreground mb-4">Academic Details</h3>
                <div className="space-y-2 text-sm font-body text-muted-foreground">
                  <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-accent" aria-hidden="true" />{alumni.department}</div>
                  {alumni.graduation_year && <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" aria-hidden="true" />Batch {alumni.graduation_year}</div>}
                  {alumni.student_id && isAuthenticated && <div className="flex items-center gap-2"><Hash className="w-4 h-4 text-accent" aria-hidden="true" />{alumni.student_id}</div>}
                  {alumni.hall_of_residence && <div className="flex items-center gap-2"><Home className="w-4 h-4 text-accent" aria-hidden="true" />{alumni.hall_of_residence}</div>}
                </div>
              </motion.div>

              <Link to="/alumni" className="flex items-center gap-2 text-sm font-heading text-accent hover:text-accent-hover">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Directory
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </motion.article>
  );
};

export default AlumniProfilePage;
