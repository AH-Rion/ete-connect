## Goal
Make stat numbers (Alumni, Countries, Companies, Years), the "Joined by X graduates / Across Y companies" badge, and the companies marquee list editable from the admin dashboard Settings tab.

## Approach
The admin Settings tab already auto-renders every row of `site_settings` as an editable input with a Save button. So we just need to (1) seed new keys in the DB and (2) make the homepage/login page read them via the existing `useSiteSettings()` context.

## Steps

1. **DB migration** — insert new `site_settings` rows (with helpful descriptions) if they don't already exist:
   - `stat_alumni_count` = "250"
   - `stat_countries_count` = "5"
   - `stat_companies_count` = "30"
   - `stat_years_count` = "12"
   - `hero_joined_count` = "500"
   - `hero_worldwide_companies` = "30"
   - `companies_list` = "Google, Microsoft, Amazon, Tesla, Meta, Apple, Samsung, Goldman Sachs, NASA, Grameenphone, IBM"

2. **`src/pages/Index.tsx`** — replace hardcoded `250 / 5 / 30 / 12`, the "Joined by 500+ / 30+" badge text, the floating cards (250+/5+/30+), and the marquee companies array with values from `settings` (parsed as numbers; companies split by comma).

3. **`src/pages/LoginPage.tsx`** — replace the hardcoded `250+ / 5+ / 30+` left-panel stats with `settings.stat_alumni_count` etc.

4. **`src/contexts/SiteSettingsContext.tsx`** — add the new keys to the `defaults` object so first paint isn't blank.

5. **Admin** — no code changes needed; new rows appear automatically in the Settings tab. The label `companies_list` will render with a helpful description ("Comma-separated company names for the homepage marquee").

## Result
Admin can change any number or the company list from /admin → Settings, and the homepage + login page update automatically.