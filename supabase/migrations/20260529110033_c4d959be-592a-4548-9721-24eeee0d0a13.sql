INSERT INTO public.site_settings (key, value, description) VALUES
  ('stat_alumni_count', '250', 'Alumni count shown in stats (number only, no +)'),
  ('stat_countries_count', '5', 'Countries count shown in stats'),
  ('stat_companies_count', '30', 'Companies count shown in stats'),
  ('stat_years_count', '12', 'Years strong shown in stats'),
  ('hero_joined_count', '500', 'Number shown in "Joined by X+ graduates" hero badge'),
  ('hero_worldwide_companies', '30', 'Number shown in "Across X+ companies worldwide" hero badge'),
  ('companies_list', 'Google, Microsoft, Amazon, Tesla, Meta, Apple, Samsung, Goldman Sachs, NASA, Grameenphone, IBM', 'Comma-separated company names for the homepage marquee')
ON CONFLICT (key) DO NOTHING;