-- ============================================================
-- RUN THIS IN YOUR EXTERNAL SUPABASE PROJECT'S SQL EDITOR
-- Dashboard → SQL Editor → New query → paste & run
-- Project: wproesbyazmuzfzwqgtg
-- ============================================================

-- 1) EDUCATION TABLE -----------------------------------------
CREATE TABLE IF NOT EXISTS public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  degree text NOT NULL,
  institution text NOT NULL,
  year integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.education TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.education TO authenticated;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Education publicly viewable" ON public.education;
CREATE POLICY "Education publicly viewable" ON public.education
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage own education" ON public.education;
CREATE POLICY "Users manage own education" ON public.education
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2) EMPLOYMENT TABLE ----------------------------------------
CREATE TABLE IF NOT EXISTS public.employment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company text NOT NULL,
  position text NOT NULL,
  location text,
  start_date date,
  end_date date,
  is_current boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.employment TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employment TO authenticated;
ALTER TABLE public.employment ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Employment publicly viewable" ON public.employment;
CREATE POLICY "Employment publicly viewable" ON public.employment
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage own employment" ON public.employment;
CREATE POLICY "Users manage own employment" ON public.employment
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3) ALLOW USERS TO UPDATE THEIR OWN ALUMNI ROW --------------
DROP POLICY IF EXISTS "Users update own alumni" ON public.alumni;
CREATE POLICY "Users update own alumni" ON public.alumni
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4) MIGRATE EXISTING DATA -----------------------------------
INSERT INTO public.education (user_id, degree, institution, year)
SELECT a.user_id,
       COALESCE(NULLIF(a.degree, ''), 'BSc') || ' in ETE',
       'CUET — Electronics & Telecommunication Engineering',
       a.graduation_year
FROM public.alumni a
WHERE a.user_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.education e WHERE e.user_id = a.user_id);

INSERT INTO public.employment (user_id, company, position, is_current)
SELECT a.user_id,
       COALESCE(NULLIF(a.company, ''), 'Unspecified'),
       COALESCE(NULLIF(a.job_title, ''), 'Unspecified'),
       true
FROM public.alumni a
WHERE a.user_id IS NOT NULL
  AND (NULLIF(a.company, '') IS NOT NULL OR NULLIF(a.job_title, '') IS NOT NULL)
  AND NOT EXISTS (SELECT 1 FROM public.employment e WHERE e.user_id = a.user_id);
