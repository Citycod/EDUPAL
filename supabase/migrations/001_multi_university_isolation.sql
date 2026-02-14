-- ============================================
-- MULTI-UNIVERSITY TENANT ISOLATION MIGRATION (ENHANCED)
-- ============================================
-- This migration enforces strict university-based data isolation
-- with complete RLS policies, admin overrides, and pre-seeded institutions

-- STEP 0: Add role column to profiles
-- ============================================

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles 
      ADD COLUMN role text DEFAULT 'student' CHECK (role IN ('student', 'admin', 'super_admin'));
  END IF;
END $$;

-- STEP 1: Add institution_id columns (nullable first for migration)
-- ============================================

-- Add to profiles (permanent, non-editable)
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'institution_id_permanent'
  ) THEN
    ALTER TABLE public.profiles 
      ADD COLUMN institution_id_permanent UUID REFERENCES academic.institutions(id);
  END IF;
END $$;

-- Add to resources
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'academic' 
    AND table_name = 'resources' 
    AND column_name = 'institution_id'
  ) THEN
    ALTER TABLE academic.resources 
      ADD COLUMN institution_id UUID REFERENCES academic.institutions(id);
  END IF;
END $$;

-- Add to courses
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'academic' 
    AND table_name = 'courses' 
    AND column_name = 'institution_id'
  ) THEN
    ALTER TABLE academic.courses 
      ADD COLUMN institution_id UUID REFERENCES academic.institutions(id);
  END IF;
END $$;

-- Add to posts
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'academic' 
    AND table_name = 'posts' 
    AND column_name = 'institution_id'
  ) THEN
    ALTER TABLE academic.posts 
      ADD COLUMN institution_id UUID REFERENCES academic.institutions(id);
  END IF;
END $$;

-- Add to comments
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'academic' 
    AND table_name = 'comments' 
    AND column_name = 'institution_id'
  ) THEN
    ALTER TABLE academic.comments 
      ADD COLUMN institution_id UUID REFERENCES academic.institutions(id);
  END IF;
END $$;

-- STEP 2: Pre-seed institutions (RECOMMENDED APPROACH)
-- ============================================
-- Instead of allowing users to create institutions, pre-populate them

INSERT INTO academic.institutions (name, location) VALUES
  ('Olabisi Onabanjo University', 'Ago-Iwoye, Ogun State'),
  ('University of Lagos', 'Akoka, Lagos State'),
  ('Obafemi Awolowo University', 'Ile-Ife, Osun State'),
  ('University of Ibadan', 'Ibadan, Oyo State'),
  ('Covenant University', 'Ota, Ogun State'),
  ('Lagos State University', 'Ojo, Lagos State'),
  ('University of Benin', 'Benin City, Edo State'),
  ('Ahmadu Bello University', 'Zaria, Kaduna State'),
  ('University of Nigeria', 'Nsukka, Enugu State'),
  ('Federal University of Technology, Akure', 'Akure, Ondo State'),
  ('Sikiru Adetona College of Education Science and Technology', 'Omu-ijebu, Ogun State'),
  ('Tai Solarin University of Education', 'Ijebu-Ode, Ogun State'),
  ('Miva Open University', 'Abuja, FCT')
ON CONFLICT (name) DO NOTHING;

-- Add more institutions as needed
-- This prevents duplicate institution names and maintains data quality

-- STEP 3: Migrate existing data
-- ============================================

-- Migrate profiles: Use existing institution_id or derive from department
UPDATE public.profiles p
SET institution_id_permanent = COALESCE(
  p.institution_id,
  (SELECT d.institution_id FROM academic.departments d WHERE d.id = p.department_id)
)
WHERE institution_id_permanent IS NULL;

-- Migrate courses: Derive from department
UPDATE academic.courses c
SET institution_id = d.institution_id
FROM academic.departments d
WHERE c.department_id = d.id
AND c.institution_id IS NULL;

-- Migrate resources: Derive from course -> department -> institution
UPDATE academic.resources r
SET institution_id = d.institution_id
FROM academic.courses c
JOIN academic.departments d ON c.department_id = d.id
WHERE r.course_id = c.id
AND r.institution_id IS NULL;

-- Migrate posts: Derive from course -> department -> institution
UPDATE academic.posts p
SET institution_id = d.institution_id
FROM academic.courses c
JOIN academic.departments d ON c.department_id = d.id
WHERE p.course_id = c.id
AND p.institution_id IS NULL;

-- Migrate comments: Derive from post
UPDATE academic.comments cm
SET institution_id = p.institution_id
FROM academic.posts p
WHERE cm.post_id = p.id
AND cm.institution_id IS NULL;

-- STEP 4: Set NOT NULL constraints
-- ============================================
-- WARNING: This will fail if any records still have NULL institution_id
-- Review data before running this step

-- Uncomment after verifying all data is migrated:
-- ALTER TABLE public.profiles ALTER COLUMN institution_id_permanent SET NOT NULL;
-- ALTER TABLE academic.resources ALTER COLUMN institution_id SET NOT NULL;
-- ALTER TABLE academic.courses ALTER COLUMN institution_id SET NOT NULL;
-- ALTER TABLE academic.posts ALTER COLUMN institution_id SET NOT NULL;
-- ALTER TABLE academic.comments ALTER COLUMN institution_id SET NOT NULL;

-- STEP 5: Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_institution_permanent 
  ON public.profiles(institution_id_permanent);

CREATE INDEX IF NOT EXISTS idx_profiles_role 
  ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_resources_institution 
  ON academic.resources(institution_id);

CREATE INDEX IF NOT EXISTS idx_courses_institution 
  ON academic.courses(institution_id);

CREATE INDEX IF NOT EXISTS idx_posts_institution 
  ON academic.posts(institution_id);

CREATE INDEX IF NOT EXISTS idx_comments_institution 
  ON academic.comments(institution_id);

-- STEP 6: Update unique constraints
-- ============================================

-- Courses must be unique per institution (not just per department)
DO $$
BEGIN
  -- Drop old constraint if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'courses_course_code_department_id_key'
    AND table_name = 'courses'
  ) THEN
    ALTER TABLE academic.courses 
      DROP CONSTRAINT courses_course_code_department_id_key;
  END IF;
  
  -- Add new constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'courses_unique_per_institution'
    AND table_name = 'courses'
  ) THEN
    ALTER TABLE academic.courses 
      ADD CONSTRAINT courses_unique_per_institution 
      UNIQUE(course_code, department_id, institution_id);
  END IF;
END $$;

-- STEP 7: Create helper functions
-- ============================================

-- Get user's institution ID
CREATE OR REPLACE FUNCTION public.get_user_institution_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT institution_id_permanent 
    FROM public.profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role IN ('admin', 'super_admin')
    FROM public.profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- STEP 8: Update RLS policies with COMPLETE coverage
-- ============================================

-- ========================================
-- PROFILES TABLE POLICIES
-- ========================================

-- SELECT: Users can see profiles from their institution OR if they're admin
DROP POLICY IF EXISTS "profiles_select_own_institution" ON public.profiles;
CREATE POLICY "profiles_select_own_institution" ON public.profiles 
  FOR SELECT USING (
    institution_id_permanent = public.get_user_institution_id()
    OR public.is_admin()
  );

-- UPDATE: Users can update their own profile, but cannot change institution
DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self" ON public.profiles 
  FOR UPDATE USING (
    id = auth.uid()
  )
  WITH CHECK (
    id = auth.uid()
    AND (
      -- Institution must match current user's institution (prevents changing it)
      institution_id_permanent = public.get_user_institution_id()
      OR public.is_admin()  -- Unless admin
    )
  );

-- ========================================
-- RESOURCES TABLE POLICIES
-- ========================================

-- SELECT: Institution isolation with admin override
DROP POLICY IF EXISTS "academic_resources_select_inst" ON academic.resources;
CREATE POLICY "academic_resources_select_inst" ON academic.resources 
  FOR SELECT USING (
    institution_id = public.get_user_institution_id()
    OR public.is_admin()
  );

-- INSERT: Auto-scope to user's institution
DROP POLICY IF EXISTS "academic_resources_insert_inst" ON academic.resources;
CREATE POLICY "academic_resources_insert_inst" ON academic.resources 
  FOR INSERT WITH CHECK (
    institution_id = public.get_user_institution_id()
    OR public.is_admin()
  );

-- UPDATE: Can only update resources from own institution
DROP POLICY IF EXISTS "academic_resources_update_inst" ON academic.resources;
CREATE POLICY "academic_resources_update_inst" ON academic.resources 
  FOR UPDATE USING (
    institution_id = public.get_user_institution_id()
    OR public.is_admin()
  )
  WITH CHECK (
    institution_id = public.get_user_institution_id()
    OR public.is_admin()
  );

-- DELETE: Can only delete resources from own institution (and own uploads)
DROP POLICY IF EXISTS "academic_resources_delete_inst" ON academic.resources;
CREATE POLICY "academic_resources_delete_inst" ON academic.resources 
  FOR DELETE USING (
    (institution_id = public.get_user_institution_id() AND uploader_id = auth.uid())
    OR public.is_admin()
  );

-- ========================================
-- COURSES TABLE POLICIES
-- ========================================

-- SELECT: Institution isolation with admin override
DROP POLICY IF EXISTS "academic_courses_select_inst" ON academic.courses;
CREATE POLICY "academic_courses_select_inst" ON academic.courses 
  FOR SELECT USING (
    institution_id = public.get_user_institution_id()
    OR public.is_admin()
  );

-- INSERT: Auto-scope to user's institution
DROP POLICY IF EXISTS "academic_courses_insert_inst" ON academic.courses;
CREATE POLICY "academic_courses_insert_inst" ON academic.courses 
  FOR INSERT WITH CHECK (
    institution_id = public.get_user_institution_id()
    OR public.is_admin()
  );

-- UPDATE: Can only update courses from own institution
DROP POLICY IF EXISTS "academic_courses_update_inst" ON academic.courses;
CREATE POLICY "academic_courses_update_inst" ON academic.courses 
  FOR UPDATE USING (
    institution_id = public.get_user_institution_id()
    OR public.is_admin()
  )
  WITH CHECK (
    institution_id = public.get_user_institution_id()
    OR public.is_admin()
  );

-- DELETE: Can only delete courses from own institution (admin only)
DROP POLICY IF EXISTS "academic_courses_delete_inst" ON academic.courses;
CREATE POLICY "academic_courses_delete_inst" ON academic.courses 
  FOR DELETE USING (
    public.is_admin()
  );

-- ========================================
-- POSTS TABLE POLICIES
-- ========================================

-- SELECT: Institution isolation with admin override
DROP POLICY IF EXISTS "academic_posts_select_inst" ON academic.posts;
CREATE POLICY "academic_posts_select_inst" ON academic.posts 
  FOR SELECT USING (
    institution_id = public.get_user_institution_id()
    OR public.is_admin()
  );

-- INSERT: Auto-scope to user's institution
DROP POLICY IF EXISTS "academic_posts_insert_inst" ON academic.posts;
CREATE POLICY "academic_posts_insert_inst" ON academic.posts 
  FOR INSERT WITH CHECK (
    institution_id = public.get_user_institution_id()
    OR public.is_admin()
  );

-- UPDATE: Can only update own posts from own institution
DROP POLICY IF EXISTS "academic_posts_update_inst" ON academic.posts;
CREATE POLICY "academic_posts_update_inst" ON academic.posts 
  FOR UPDATE USING (
    (institution_id = public.get_user_institution_id() AND author_id = auth.uid())
    OR public.is_admin()
  )
  WITH CHECK (
    (institution_id = public.get_user_institution_id() AND author_id = auth.uid())
    OR public.is_admin()
  );

-- DELETE: Can only delete own posts from own institution
DROP POLICY IF EXISTS "academic_posts_delete_inst" ON academic.posts;
CREATE POLICY "academic_posts_delete_inst" ON academic.posts 
  FOR DELETE USING (
    (institution_id = public.get_user_institution_id() AND author_id = auth.uid())
    OR public.is_admin()
  );

-- ========================================
-- COMMENTS TABLE POLICIES
-- ========================================

-- SELECT: Institution isolation with admin override
DROP POLICY IF EXISTS "academic_comments_select_inst" ON academic.comments;
CREATE POLICY "academic_comments_select_inst" ON academic.comments 
  FOR SELECT USING (
    institution_id = public.get_user_institution_id()
    OR public.is_admin()
  );

-- INSERT: Auto-scope to user's institution
DROP POLICY IF EXISTS "academic_comments_insert_inst" ON academic.comments;
CREATE POLICY "academic_comments_insert_inst" ON academic.comments 
  FOR INSERT WITH CHECK (
    institution_id = public.get_user_institution_id()
    OR public.is_admin()
  );

-- UPDATE: Can only update own comments from own institution
DROP POLICY IF EXISTS "academic_comments_update_inst" ON academic.comments;
CREATE POLICY "academic_comments_update_inst" ON academic.comments 
  FOR UPDATE USING (
    (institution_id = public.get_user_institution_id() AND author_id = auth.uid())
    OR public.is_admin()
  )
  WITH CHECK (
    (institution_id = public.get_user_institution_id() AND author_id = auth.uid())
    OR public.is_admin()
  );

-- DELETE: Can only delete own comments from own institution
DROP POLICY IF EXISTS "academic_comments_delete_inst" ON academic.comments;
CREATE POLICY "academic_comments_delete_inst" ON academic.comments 
  FOR DELETE USING (
    (institution_id = public.get_user_institution_id() AND author_id = auth.uid())
    OR public.is_admin()
  );

-- STEP 9: Update registration trigger (SELECT from pre-seeded institutions)
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user_with_institution()
RETURNS TRIGGER AS $$
DECLARE
  v_inst_id uuid;
  v_dept_id uuid;
  v_inst_name text;
  v_dept_name text;
  v_level text;
BEGIN
  -- Extract metadata from signup
  v_inst_name := NULLIF(NEW.raw_user_meta_data->>'university', '');
  v_dept_name := NULLIF(NEW.raw_user_meta_data->>'major', '');
  v_level := NULLIF(NEW.raw_user_meta_data->>'year', '');

  -- CRITICAL: Only SELECT from existing institutions (no auto-create)
  IF v_inst_name IS NOT NULL THEN
    SELECT id INTO v_inst_id
    FROM academic.institutions
    WHERE name = v_inst_name;
    
    IF v_inst_id IS NULL THEN
      RAISE EXCEPTION 'Invalid institution: %. Please select from approved list.', v_inst_name;
    END IF;
  ELSE
    RAISE EXCEPTION 'University selection is required during registration';
  END IF;

  -- Handle Department (can auto-create if needed)
  IF v_dept_name IS NOT NULL AND v_inst_id IS NOT NULL THEN
    INSERT INTO academic.departments (name, institution_id)
    VALUES (v_dept_name, v_inst_id)
    ON CONFLICT (name, institution_id) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_dept_id;
  END IF;

  -- Create Profile with permanent institution
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    institution_id, 
    institution_id_permanent,
    department_id, 
    level, 
    university, 
    major, 
    year,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'),
    v_inst_id,
    v_inst_id, -- Set permanent institution
    v_dept_id,
    COALESCE(v_level, NEW.raw_user_meta_data->>'year'),
    v_inst_name,
    v_dept_name,
    v_level,
    'student' -- Default role
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Replace old trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_with_institution();

-- VERIFICATION QUERIES
-- ============================================

-- Check for NULL institution_ids
-- SELECT 'profiles' as table_name, COUNT(*) as null_count FROM public.profiles WHERE institution_id_permanent IS NULL
-- UNION ALL
-- SELECT 'resources', COUNT(*) FROM academic.resources WHERE institution_id IS NULL
-- UNION ALL
-- SELECT 'courses', COUNT(*) FROM academic.courses WHERE institution_id IS NULL
-- UNION ALL
-- SELECT 'posts', COUNT(*) FROM academic.posts WHERE institution_id IS NULL
-- UNION ALL
-- SELECT 'comments', COUNT(*) FROM academic.comments WHERE institution_id IS NULL;

-- View institution distribution
-- SELECT i.name, COUNT(p.id) as student_count
-- FROM academic.institutions i
-- LEFT JOIN public.profiles p ON i.id = p.institution_id_permanent
-- GROUP BY i.name
-- ORDER BY student_count DESC;

-- Test RLS policies (run as regular user)
-- SELECT COUNT(*) FROM academic.resources; -- Should only see own institution
-- SELECT COUNT(*) FROM academic.courses; -- Should only see own institution
