import { motion } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, scaleIn } from '@/lib/animations';
import { pageTransition } from '@/lib/animations';
import { Users, Briefcase, Star, GraduationCap, Globe, TrendingUp, Heart, Target, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const milestones = [
  { year: '1995', title: 'Department Established', desc: 'ETE department founded at CUET' },
  { year: '2000', title: 'First Batch Graduates', desc: 'The first batch of ETE engineers graduate' },
  { year: '2010', title: '500+ Alumni Milestone', desc: 'Half a thousand alumni and growing' },
  { year: '2020', title: 'International Recognition', desc: 'Alumni placed in top global companies' },
  { year: '2024', title: 'ETE Family Launched', desc: 'The alumni portal goes live' },
];

const benefits = [
  { icon: Users, title: 'Network with Alumni', desc: 'Connect with fellow graduates across the globe' },
  { icon: Briefcase, title: 'Career Opportunities', desc: 'Discover jobs through our alumni network' },
  { icon: Star, title: 'Mentor Students', desc: 'Guide current students on their career path' },
  { icon: GraduationCap, title: 'Stay Connected', desc: 'Keep in touch with your alma mater' },
  { icon: Globe, title: 'Global Reach', desc: 'Our alumni span 30+ countries worldwide' },
  { icon: TrendingUp, title: 'Professional Growth', desc: 'Grow through events and workshops' },
];

const AboutPage = () => (
  <motion.div {...pageTransition} className="pt-16">
    {/* Hero */}
    <section className="gradient-hero py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 variants={fadeInUp} initial="hidden" animate="visible" className="text-4xl font-heading font-bold text-text-on-dark">About ETE Family</motion.h1>
        <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="text-text-on-dark/70 font-body mt-4 max-w-2xl mx-auto">
          Connecting generations of Electronics & Telecommunication Engineering graduates from Chittagong University of Engineering & Technology
        </motion.p>
      </div>
    </section>

    {/* Story */}
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
            <h2 className="text-3xl font-heading font-bold text-foreground">Our Story</h2>
            <div className="w-16 h-1 bg-accent rounded-full" />
            <p className="text-muted-foreground font-body leading-relaxed">
              ETE Family was born from a simple idea: that the bonds formed during our years at CUET's ETE department shouldn't fade with time. Our alumni are spread across the globe — from Silicon Valley to Singapore, from London to Dhaka — yet they all share the same foundation.
            </p>
            <p className="text-muted-foreground font-body leading-relaxed">
              This platform bridges generations of engineers, enabling mentorship, career growth, and lifelong connections. Whether you graduated in 1995 or 2024, you're part of this family.
            </p>
          </motion.div>
          <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-accent/10 rounded-2xl p-12 flex items-center justify-center">
            <GraduationCap className="w-32 h-32 text-accent/40" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-background rounded-xl p-8 shadow-sm border-l-4 border-accent">
            <Target className="w-10 h-10 text-accent mb-4" />
            <h3 className="text-xl font-heading font-bold text-foreground mb-3">Our Mission</h3>
            <p className="text-muted-foreground font-body">To create a vibrant network connecting ETE alumni across generations, fostering mentorship, professional growth, and lasting relationships.</p>
          </motion.div>
          <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-background rounded-xl p-8 shadow-sm border-l-4 border-primary">
            <Heart className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-heading font-bold text-foreground mb-3">Our Vision</h3>
            <p className="text-muted-foreground font-body">To build the most active and supportive alumni community in Bangladesh's engineering education landscape, setting a benchmark for others.</p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-foreground">Why Join ETE Family?</h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4 rounded-full" />
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((b, i) => (
            <motion.div key={i} variants={scaleIn} className="bg-card rounded-xl p-6 shadow-sm card-hover text-center">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <b.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{b.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Timeline */}
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-foreground">ETE Department Timeline</h2>
        </motion.div>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-accent/30" />
          {milestones.map((m, i) => (
            <motion.div key={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative pl-16 pb-10 last:pb-0">
              <div className="absolute left-4 w-5 h-5 rounded-full bg-accent border-4 border-card" />
              <span className="text-sm font-heading font-bold text-accent">{m.year}</span>
              <h3 className="font-heading font-semibold text-foreground mt-1">{m.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </motion.div>
);

export default AboutPage;
