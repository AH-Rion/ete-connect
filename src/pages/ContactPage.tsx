import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
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
                {[
                  { icon: MapPin, label: 'Address', value: 'Dept. of ETE, CUET, Chittagong-4349, Bangladesh' },
                  { icon: Mail, label: 'Email', value: settings.contact_email },
                  { icon: Phone, label: 'Phone', value: settings.contact_phone },
                ].map((c, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-card rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <c.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-heading font-semibold text-foreground">{c.label}</p>
                      <p className="text-sm text-muted-foreground font-body">{c.value}</p>
                    </div>
                  </div>
                ))}
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
