import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export interface EventGalleryItem {
  id: string;
  image_url: string;
  title: string;
  description: string | null;
  event_date: string | null;
  created_at: string;
}

const formatDate = (d?: string | null) => {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return d;
  }
};

export const EventGallery = () => {
  const [items, setItems] = useState<EventGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<EventGalleryItem | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('event_gallery' as any)
        .select('*')
        .order('event_date', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });
      setItems((data as any) || []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null);
    if (active) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active]);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: '#0A192F',
        padding: '100px 2rem',
        borderTop: '1px solid rgba(34,211,238,0.08)',
        borderBottom: '1px solid rgba(34,211,238,0.08)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="max-w-[72rem] mx-auto relative">
        <div className="text-center mb-12">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-medium tracking-wider uppercase"
            style={{
              background: 'rgba(34,211,238,0.08)',
              border: '1px solid rgba(34,211,238,0.25)',
              color: '#67E8F9',
            }}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Event Gallery
          </span>
          <h2
            className="mt-5"
            style={{
              fontFamily: "'Calistoga', serif",
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              color: '#fff',
              lineHeight: 1.1,
            }}
          >
            Moments from <span style={{ background: 'linear-gradient(135deg,#22D3EE,#3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>our journey</span>
          </h2>
          <p
            className="mt-4 max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', lineHeight: 1.7 }}
          >
            Industrial tours, lab visits, reunions and celebrations — glimpses of the ETE family in action.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px dashed rgba(255,255,255,0.12)',
            }}
          >
            <ImageIcon className="w-10 h-10 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>No events available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((it, idx) => (
              <motion.button
                key={it.id}
                type="button"
                onClick={() => setActive(it)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: (idx % 6) * 0.05 }}
                className="group relative overflow-hidden rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  aspectRatio: '4 / 3',
                }}
              >
                <img
                  src={it.image_url}
                  alt={it.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                {/* hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(to top, rgba(10,25,47,0.95) 0%, rgba(10,25,47,0.5) 50%, transparent 100%)',
                  }}
                />
                {/* cyan glow ring on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(34,211,238,0.5), 0 0 30px rgba(34,211,238,0.25)' }}
                />
                <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3
                    className="text-[17px] font-semibold leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: '#fff' }}
                  >
                    {it.title}
                  </h3>
                  {it.event_date && (
                    <p
                      className="mt-1 text-[12px] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: '#67E8F9' }}
                    >
                      <Calendar className="w-3 h-3" /> {formatDate(it.event_date)}
                    </p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            style={{
              background: 'rgba(2,6,23,0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(10,25,47,0.95)',
                border: '1px solid rgba(34,211,238,0.25)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(34,211,238,0.15)',
              }}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="bg-black flex items-center justify-center" style={{ maxHeight: '70vh' }}>
                <img
                  src={active.image_url}
                  alt={active.title}
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '70vh' }}
                />
              </div>

              <div className="p-6 sm:p-7">
                <h3
                  className="text-[22px] sm:text-[26px] font-semibold leading-tight"
                  style={{ color: '#fff', fontFamily: "'Calistoga', serif" }}
                >
                  {active.title}
                </h3>
                {active.event_date && (
                  <p className="mt-2 text-[13px] flex items-center gap-1.5" style={{ color: '#67E8F9' }}>
                    <Calendar className="w-3.5 h-3.5" /> {formatDate(active.event_date)}
                  </p>
                )}
                {active.description && (
                  <p className="mt-4 text-[15px]" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                    {active.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EventGallery;
