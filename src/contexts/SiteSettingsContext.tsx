import { useState, useEffect, createContext, useContext } from 'react';
import { cloudSupabase } from '@/lib/cloudClient';

interface SiteSettings {
  site_title: string;
  hero_title: string;
  hero_subtitle: string;
  contact_email: string;
  contact_phone: string;
  [key: string]: string;
}

const defaults: SiteSettings = {
  site_title: 'ETE Family',
  hero_title: 'Connecting ETE Alumni',
  hero_subtitle: 'Join the official alumni network of the Department of Electronics & Telecommunication Engineering, CUET. Stay connected, mentor students, and grow your professional network.',
  contact_email: 'alumni@ete.cuet.ac.bd',
  contact_phone: '+880 1234 567890',
};

const SiteSettingsContext = createContext<SiteSettings>(defaults);

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const SiteSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaults);

  useEffect(() => {
    cloudSupabase
      .from('site_settings')
      .select('key, value')
      .then(({ data }) => {
        if (data) {
          const merged = { ...defaults };
          data.forEach((row: { key: string; value: string | null }) => {
            if (row.value) merged[row.key] = row.value;
          });
          setSettings(merged);
        }
      });
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
