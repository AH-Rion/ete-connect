import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Mail, Phone, Linkedin, Globe, GraduationCap, Copy, Check, ExternalLink, ArrowLeft, Star, Building2, Calendar, Hash, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { fadeInUp } from '@/lib/animations';
import { pageTransition } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface AlumniProfile {
  id: string;
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
  previous_companies: string | null;
  skills: string | null;
  willing_to_mentor: boolean;
  bio: string | null;
}

const AlumniProfilePage = () => {
  const { id } = useParams();
  const [alumni, setAlumni] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from('alumni').select('*').eq('id', id).eq('is_approved', true).single()
      .then(({ data, error }) => {
        if (!error) setAlumni(data);
        setLoading(false);
      });
  }, [id]);

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
        <GraduationCap className="w-16 h-16 text-muted-foreground/40 mx-auto" />
        <h1 className="text-2xl font-heading font-bold text-foreground">Alumni Profile Not Found</h1>
        <Link to="/alumni"><Button variant="outline" className="font-heading"><ArrowLeft className="w-4 h-4 mr-2" />Back to Directory</Button></Link>
      </div>
    </div>
  );

  const skills = alumni.skills?.split(',').map(s => s.trim()).filter(Boolean) || [];
  const prevCompanies = alumni.previous_companies?.split('\n').filter(Boolean) || [];

  return (
    <motion.div {...pageTransition} className="pt-16">
      {/* Header */}
      <section className="gradient-hero py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <div className="w-28 h-28 rounded-full bg-accent flex items-center justify-center text-4xl font-heading font-bold text-accent-foreground mx-auto ring-4 ring-accent/30 mb-4">
              {alumni.full_name.charAt(0)}
            </div>
            <h1 className="text-3xl font-heading font-bold text-text-on-dark">{alumni.full_name}</h1>
            <p className="text-xl text-text-on-dark/70 font-body mt-1">{alumni.job_title} {alumni.company && `@ ${alumni.company}`}</p>
            {alumni.city && <p className="text-text-on-dark/50 font-body flex items-center justify-center gap-1 mt-1"><MapPin className="w-4 h-4" />{alumni.city}, {alumni.country}</p>}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge className="bg-accent/20 text-accent font-heading">Batch {alumni.graduation_year}</Badge>
              {alumni.degree && <Badge className="bg-text-on-dark/10 text-text-on-dark font-heading">{alumni.degree}</Badge>}
              {alumni.industry && <Badge className="bg-text-on-dark/10 text-text-on-dark font-heading">{alumni.industry}</Badge>}
              {alumni.willing_to_mentor && <Badge className="bg-accent/20 text-accent font-heading"><Star className="w-3 h-3 mr-1" />Available for Mentoring</Badge>}
            </div>
            <div className="flex gap-3 justify-center mt-6">
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent-hover font-heading">
                <a href={`mailto:${alumni.email}`}><Mail className="w-4 h-4 mr-2" />Connect via Email</a>
              </Button>
              <Button variant="outline" className="border-text-on-dark/30 text-text-on-dark hover:bg-text-on-dark/10 font-heading"
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
                <Share2 className="w-4 h-4 mr-1" /> Share Profile
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              {alumni.bio && (
                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-xl p-6 shadow-sm">
                  <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2"><span className="text-3xl text-accent">"</span> About</h2>
                  <p className="text-muted-foreground font-body italic leading-relaxed">{alumni.bio}</p>
                </motion.div>
              )}
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-accent" /> Professional Journey</h2>
                <div className="space-y-3">
                  {alumni.employment_status && <div><Badge className="bg-success/10 text-success">{alumni.employment_status}</Badge></div>}
                  {alumni.job_title && <p className="font-body"><span className="font-semibold">{alumni.job_title}</span> at <span className="font-semibold">{alumni.company}</span></p>}
                  <p className="text-sm text-muted-foreground font-body">{alumni.years_of_experience} years of experience</p>
                  {prevCompanies.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-heading font-semibold text-foreground mb-2">Previous Companies</p>
                      <div className="border-l-2 border-accent/30 pl-4 space-y-2">
                        {prevCompanies.map((c, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[1.35rem] top-1.5 w-2.5 h-2.5 rounded-full bg-accent" />
                            <p className="text-sm text-muted-foreground font-body">{c}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-heading font-semibold text-foreground mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((s, i) => <Badge key={i} variant="outline" className="text-xs hover:scale-105 transition-transform">{s}</Badge>)}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
              {alumni.university_memory && (
                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-xl p-6 shadow-sm">
                  <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-accent" /> University Memory</h2>
                  <p className="text-muted-foreground font-body italic">"{alumni.university_memory}"</p>
                  <p className="text-sm text-accent font-heading mt-2">— Batch of {alumni.graduation_year}</p>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-xl p-6 shadow-sm glass">
                <h3 className="font-heading font-semibold text-foreground mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-body text-muted-foreground min-w-0">
                      <Mail className="w-4 h-4 shrink-0 text-accent" />
                      <a href={`mailto:${alumni.email}`} className="truncate hover:text-accent">{alumni.email}</a>
                    </div>
                    <button onClick={() => copyToClipboard(alumni.email, 'email')} className="text-muted-foreground hover:text-accent shrink-0">
                      {copiedField === 'email' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {alumni.phone && (
                    <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                      <Phone className="w-4 h-4 shrink-0 text-accent" />
                      <a href={`tel:${alumni.phone}`} className="hover:text-accent">{alumni.phone}</a>
                    </div>
                  )}
                  {alumni.linkedin_url && (
                    <a href={alumni.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-body text-accent hover:text-accent-hover">
                      <Linkedin className="w-4 h-4" /> View LinkedIn <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {alumni.website_url && (
                    <a href={alumni.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-body text-accent hover:text-accent-hover">
                      <Globe className="w-4 h-4" /> Visit Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-xl p-6 shadow-sm">
                <h3 className="font-heading font-semibold text-foreground mb-4">Academic Details</h3>
                <div className="space-y-2 text-sm font-body text-muted-foreground">
                  <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-accent" />{alumni.department}</div>
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" />{alumni.degree} · {alumni.graduation_year}</div>
                  {alumni.student_id && <div className="flex items-center gap-2"><Hash className="w-4 h-4 text-accent" />{alumni.student_id}</div>}
                  {alumni.hall_of_residence && <div className="flex items-center gap-2"><Home className="w-4 h-4 text-accent" />{alumni.hall_of_residence}</div>}
                </div>
              </motion.div>

              <Link to="/alumni" className="flex items-center gap-2 text-sm font-heading text-accent hover:text-accent-hover">
                <ArrowLeft className="w-4 h-4" /> Back to Directory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default AlumniProfilePage;
