import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send } from 'lucide-react';
import { fadeInUp, fadeInLeft, fadeInRight } from '@/lib/animations';
import { pageTransition } from '@/lib/animations';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email').max(255),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

const faqs = [
  { q: 'How do I register as an alumni?', a: 'Click on "Register as Alumni" in the navigation, log in with your Google account or email, and fill out the multi-step registration form with your personal, academic, and professional details.' },
  { q: 'How long does approval take?', a: 'Our admin team typically reviews submissions within 2-3 business days. You\'ll see your status when you visit the registration page.' },
  { q: 'Can I edit my profile after registration?', a: 'Currently, you can contact the admin team to request changes to your profile. Self-editing features are coming soon!' },
  { q: 'Who can see my contact information?', a: 'Only logged-in users can view full alumni profiles and contact details. Basic information like name, batch, and company is visible to everyone.' },
  { q: 'Is this platform only for ETE graduates?', a: 'While primarily designed for ETE graduates of CUET, the registration form supports other departments as well. The platform focuses on the ETE community.' },
  { q: 'How can I become a mentor?', a: 'During the registration process, toggle on "Willing to Mentor Students" in the Professional Information step. Your profile will display a mentor badge.' },
];

const ContactPage = () => {
  const settings = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof contactSchema>>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: z.infer<typeof contactSchema>) => {
    setLoading(true);
    try {
      // Save to database
      await supabase.from('contact_messages').insert(data);

      // Send email notification via Cloud edge function
      const res = await fetch(
        'https://fhzsksqfvkviwhwndhdw.supabase.co/functions/v1/send-contact-email',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to send email');
      }

      toast.success('Message sent! We\'ll get back to you soon.');
      form.reset();
    } catch (e: any) {
      toast.error(e.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div {...pageTransition} className="pt-16">
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 variants={fadeInUp} initial="hidden" animate="visible" className="text-4xl font-heading font-bold text-text-on-dark">Get in Touch</motion.h1>
          <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="text-text-on-dark/70 font-body mt-4">Have questions? We'd love to hear from you.</motion.p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Send us a Message</h2>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Input {...form.register('name')} placeholder="Your Name" />
                  {form.formState.errors.name && <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>}
                </div>
                <div>
                  <Input {...form.register('email')} placeholder="Your Email" type="email" />
                  {form.formState.errors.email && <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>}
                </div>
                <Input {...form.register('subject')} placeholder="Subject (optional)" />
                <div>
                  <Textarea {...form.register('message')} placeholder="Your message..." rows={5} className="resize-none" maxLength={1000} />
                  {form.formState.errors.message && <p className="text-xs text-destructive mt-1">{form.formState.errors.message.message}</p>}
                </div>
                <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent-hover font-heading w-full py-5">
                  <Send className="w-4 h-4 mr-2" />{loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </motion.div>

            <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Contact Information</h2>
              <div className="space-y-4">
{/* 1. Address Block */}
      <div className="flex items-start gap-4 p-4 bg-card rounded-lg">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-heading font-semibold text-foreground">Address</p>
          <a 
            href="https://maps.app.goo.gl/spkTVt2nMWc9RtxRA" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground mt-1 text-sm hover:text-primary transition-colors cursor-pointer block"
          >
            Dept. of ETE, CUET, Chittagong-4349, Bangladesh
          </a>
        </div>
      </div>

      {/* 2. Email Block */}
      <div className="flex items-start gap-4 p-4 bg-card rounded-lg">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Mail className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-heading font-semibold text-foreground">Email</p>
          <a 
            href="mailto:ahrionofc@example.com" 
            className="text-muted-foreground mt-1 text-sm hover:text-primary transition-colors cursor-pointer block"
          >
            ahrionofc@example.com
          </a>
        </div>
      </div>

      {/* 3. WhatsApp Block */}
      <div className="flex items-start gap-4 p-4 bg-card rounded-lg">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-primary fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-heading font-semibold text-foreground">WhatsApp</p>
          <a 
            href="https://wa.me/8801313729422" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground mt-1 text-sm hover:text-primary transition-colors cursor-pointer block"
          >
            01313729422
          </a>
        </div>
      </div>
              </div>
              <div className="rounded-lg overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.2!2d91.971!3d22.4614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad2fd0b1f6571b%3A0x6e66c11193ee4097!2sChittagong%20University%20of%20Engineering%20%26%20Technology%20(CUET)!5e0!3m2!1sen!2sbd!4v1700000000000"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="CUET Location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-card" id="faq">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-accent mx-auto mt-4 rounded-full" />
          </motion.div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-lg px-6 border">
                <AccordionTrigger className="font-heading text-sm font-medium text-foreground hover:text-accent">{faq.q}</AccordionTrigger>
                <AccordionContent className="font-body text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </motion.div>
  );
};

export default ContactPage;
