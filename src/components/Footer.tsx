import { Link } from 'react-router-dom';
import { GraduationCap, Facebook, Linkedin, Twitter, Github, Mail, Phone, MapPin } from 'lucide-react';

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

export const Footer = () => (
  <footer className="bg-bg-dark text-text-on-dark">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-accent" />
            <span className="font-heading font-bold text-xl"><span className="text-accent">ETE</span> Family</span>
          </div>
          <p className="text-sm text-text-on-dark/70 leading-relaxed">
            Connecting generations of Electronics & Telecommunication Engineering graduates from CUET.
          </p>
          <div className="flex gap-3">
            {[Facebook, Linkedin, Twitter, Github].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-surface-dark flex items-center justify-center text-text-on-dark/60 hover:text-accent hover:scale-110 transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-accent mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l.path}><Link to={l.path} className="text-sm text-text-on-dark/70 hover:text-accent transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-accent mb-4">Resources</h4>
          <ul className="space-y-2">
            {resources.map((l) => (
              <li key={l.label}><Link to={l.path} className="text-sm text-text-on-dark/70 hover:text-accent transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-accent mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-text-on-dark/70">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" />Dept. of ETE, CUET, Chittagong, Bangladesh</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" />etefamily@cuet.ac.bd</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" />+880-31-XXXXXXX</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="border-t border-surface-dark">
      <div className="container mx-auto px-4 py-4">
        <p className="text-center text-sm text-text-on-dark/50">
          © 2025 ETE Family. Made with ❤️ for our alumni community.
        </p>
      </div>
    </div>
  </footer>
);
