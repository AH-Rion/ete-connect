import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, scaleIn } from '@/lib/animations';
import { pageTransition } from '@/lib/animations';
import { Users, Briefcase, Star, GraduationCap, Globe, TrendingUp, Heart, Target, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import cuetHero1 from '@/assets/cuet-hero-1.png';
import cuetHero2 from '@/assets/cuet-hero-2.png';
import cuetHero3 from '@/assets/cuet-hero-3.png';

const heroImages = [cuetHero1, cuetHero2, cuetHero3];

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

const AboutPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div {...pageTransition} className="pt-16">
      {/* Hero Slideshow */}
      <section className="relative overflow-hidden h-[300px] md:h-[420px] bg-background">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={heroImages[currentSlide]}
            alt="CUET ETE Department"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border border-white/40 ${
                i === currentSlide ? 'bg-primary scale-125 border-primary' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-5">
              <div>
                <h2 className="text-3xl font-heading font-bold text-foreground">Department of</h2>
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold mt-1">
                  <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                    Electronics & Telecommunication Engineering (ETE)
                  </span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-accent to-primary rounded-full mt-3" />
              </div>
              <p className="text-muted-foreground font-body leading-relaxed">
                Today, we are at the peak of the information technology age, and communication engineering plays a vital role in today's rapidly changing world. In this prospect, CUET has launched Department of Electronics and Telecommunication Engineering (ETE) in the year 2012. The vision of this department is to make great contribution by producing efficient and resourceful engineers with research and development capabilities.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed">
                The ETE Department has well qualified and experienced faculty members with areas of specialization that include Embedded Systems, Applied Electronics and VLSI design. The department has taken step to collect technologically advanced equipment and to build enriched laboratories.
              </p>
            </motion.div>
            <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-5 lg:pt-16">
              <p className="text-muted-foreground font-body leading-relaxed">
                The Department of ETE offers a comprehensive range of rigorous, innovative programs. The undergraduate curriculum is designed to give students a sound knowledge of Engineering fundamentals, strong physical sciences background and adequate practical training so that they will be ready to quickly achieve competence in treating current technical problems as well as those that will come with the rapidly changing technologies of the years to come.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed">
                The aim of the undergraduate program is to provide the students with a technical and engineering background and scientific research capabilities in the design and development and production of electronic devices, circuits and systems used in a wide spectrum of applications ranging from home appliances to the most sophisticated satellite communications.
              </p>
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
              <ul className="text-muted-foreground font-body space-y-2 list-disc list-inside text-sm leading-relaxed">
                <li>To foster and promote a distinctive educational institute identity and spirit.</li>
                <li>To purpose excellence in research that will contribute to knowledge and learning.</li>
                <li>To purpose excellence in curriculum, teaching and to a standard befitting an international research institute.</li>
                <li>To develop and maximize the effectiveness of all staff.</li>
                <li>To attract students with thirst of knowledge, to encourage and support them in their progress.</li>
                <li>To maintain the principle of academic freedom and to maintain the institutional autonomy.</li>
                <li>To contribute to the betterment of society and be responsive to its needs.</li>
                <li>To provide high quality, responsive and cost effective support service for research, learning and teaching.</li>
              </ul>
            </motion.div>
            <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-background rounded-xl p-8 shadow-sm border-l-4 border-primary">
              <Heart className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-heading font-bold text-foreground mb-3">Our Vision</h3>
              <div className="text-muted-foreground font-body space-y-3 text-sm leading-relaxed">
                <p>The Chittagong University of Engineering & Technology has been established to advance, maintain and disseminate knowledge at the international levels.</p>
                <p>The modern world increasingly values the results of intellectual endeavor. If Bangladesh is to prosper, educational institutes must play the central role in higher learning, research and teaching to increase her intellectual pursuit. In this context, the CUET has set a two-fold vision:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>To send out graduates with trained and educated minds, to serve as a source of intellectual potentiality.</li>
                  <li>To be a premier research Institute, internationally known for its excellence and contributions to knowledge, teaching and graduates.</li>
                </ul>
              </div>
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

      {/* More Info */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Want to learn more?</h2>
            <Button asChild size="lg" className="gap-2">
              <a href="https://cuet.ac.bd/department/ETE" target="_blank" rel="noopener noreferrer">
                More Info Click <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default AboutPage;
