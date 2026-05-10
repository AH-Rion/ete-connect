import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Twitter, Github } from 'lucide-react';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Alumni Directory', path: '/alumni' },
  { label: 'Register', path: '/register' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];
const resources = [
  { label: 'FAQ', path: '/contact#faq' },
  { label: 'Privacy', path: '#' },
  { label: 'Terms', path: '#' },
  { label: 'Help', path: '/contact' },
];
const community = [
  { label: 'Email', path: 'mailto:ahrionofc@gmail.com' },
  { label: 'WhatsApp', path: 'https://wa.me/8801313729422' },
  { label: 'Facebook', path: 'https://www.facebook.com/ah.rion.98' },
  { label: 'CUET ETE', path: '#' },
];

const colHeader: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(255, 255, 255, 0.35)',
  marginBottom: '20px',
};

const linkStyle: React.CSSProperties = {
  color: 'rgba(255, 255, 255, 0.55)',
  fontSize: '14px',
  transition: 'color 0.2s ease',
};

export const Footer = () => {
  return (
    <footer style={{ background: '#0F172A' }} className="relative overflow-hidden">
      <div className="dot-texture absolute inset-0 pointer-events-none opacity-60" />
      <div className="max-w-[72rem] mx-auto px-8 py-20 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white font-bold"
                style={{ background: 'linear-gradient(135deg, #0052FF, #4D7CFF)', fontFamily: "'Calistoga', serif" }}
              >E</div>
              <span className="text-[17px] font-semibold text-white">ETE Family</span>
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.7 }}>
              Connecting generations of Electronics & Telecommunication Engineering graduates from CUET.
            </p>
            <div className="flex gap-2">
              {[Facebook, Linkedin, Twitter, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-[10px] flex items-center justify-center transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={colHeader}>Navigate</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} style={linkStyle} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={colHeader}>Resources</h4>
            <ul className="space-y-3">
              {resources.map((l) => (
                <li key={l.label}>
                  <Link to={l.path} style={linkStyle} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={colHeader}>Community</h4>
            <ul className="space-y-3">
              {community.map((l) => (
                <li key={l.label}>
                  <a href={l.path} target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:text-white">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            © {new Date().getFullYear()} ETE Family · Made by <span style={{ color: '#fff' }}>AH RION</span> · ETE 24
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#0052FF' }} />
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
          </div>
        </div>
      </div>
    </footer>
  );
};
