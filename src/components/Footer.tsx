import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Twitter, Github, Mail, Phone, MapPin } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import eteLogo from '@/assets/ete-logo.png';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Alumni Directory', path: '/alumni' },
  { label: 'Register', path: '/register' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const resources = [
  { label: 'FAQ', path: '/contact#faq' },
  { label: 'Privacy Policy', path: '#' },
  { label: 'Terms of Service', path: '#' },
  { label: 'Help', path: '/contact' },
];

export const Footer = () => {
  const settings = useSiteSettings();
  return (
  <footer style={{ background: '#020617' }} className="text-text-on-dark">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <img src={eteLogo} alt="ETE Family" className="w-9 h-9 object-contain" />
            <span className="font-heading font-bold text-xl"><span className="text-primary">ETE</span> Family</span>
          </div>
          <p className="text-sm text-text-on-dark/60 leading-relaxed">
            Connecting generations of Electronics & Telecommunication Engineering graduates from CUET.
          </p>
          <div className="flex gap-3">
            {[Facebook, Linkedin, Twitter, Github].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-on-dark/50 hover:text-primary hover:border-primary/30 hover:scale-110 transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-primary mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l.path}><Link to={l.path} className="text-sm text-text-on-dark/60 hover:text-primary transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-primary mb-4">Resources</h4>
          <ul className="space-y-2">
            {resources.map((l) => (
              <li key={l.label}><Link to={l.path} className="text-sm text-text-on-dark/60 hover:text-primary transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-primary mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-text-on-dark/60">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" />Dept. of ETE, CUET, Chittagong, Bangladesh</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" />ahrionofc@gmail.com</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" />01313729422</li>
          </ul>
        </div>
      </div>
    </div>

    {/* Copyright */}
    <div className="border-t border-white/5">
      <div className="container mx-auto px-4 py-4">
        <p className="text-center text-sm text-text-on-dark/40">
          © ETE Family. Made with ❤️ for our alumni community.
        </p>
      </div>
    </div>

    {/* Made By Credit */}
    <div className="border-t border-white/5">
      <div className="container mx-auto px-4 py-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-6">
          <span className="text-base text-text-on-dark/40 font-heading tracking-wide">
            Made By <span className="text-primary font-bold text-lg">AH RION</span>
          </span>
          <span className="w-px h-5 bg-white/10" />
          <span className="text-base text-text-on-dark/40 font-heading tracking-wide">
            <span className="text-accent font-bold text-lg">ETE 24</span>
          </span>
        </div>
        <a href="https://www.facebook.com/ah.rion.98" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-sm text-text-on-dark/40 hover:text-[#1877F2] transition-colors">
          <span className="inline-block animate-bounce"><Facebook className="w-5 h-5" /></span>
          <span className="group-hover:underline">facebook.com/ah.rion.98</span>
        </a>
      </div>
    </div>
  </footer>
);
