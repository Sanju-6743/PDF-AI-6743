-- Supabase Tables for PDF Toolkit User Management and Analytics
-- Run this script in your Supabase Dashboard SQL Editor

-- Enable Row Level Security (RLS) for all tables
-- This ensures users can only access their own data

-- ==========================================
-- 1. PROFILES TABLE
-- Extends auth.users with additional user information
-- ==========================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ==========================================
-- 2. USER_ACTIVITIES TABLE
-- Tracks all user actions: logins, file uploads, tool usage, successes/failures
-- ==========================================

CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('login', 'logout', 'upload', 'download', 'tool_use', 'success', 'failure')),
    tool_name TEXT, -- e.g., 'compress', 'merge', 'split', etc.
    file_name TEXT,
    file_size_bytes BIGINT,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    processing_time_ms INTEGER, -- time taken for processing
    metadata JSONB DEFAULT '{}', -- additional data like page count, compression ratio, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own activities" ON public.user_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON public.user_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_action_type ON public.user_activities(action_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON public.user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_tool_name ON public.user_activities(tool_name);

-- ==========================================
-- 3. ANALYSIS_REPORTS TABLE
-- Stores comprehensive analytics and reports for users
-- ==========================================

CREATE TABLE IF NOT EXISTS public.analysis_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    report_type TEXT NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly', 'custom')),
    report_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    report_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    total_logins INTEGER DEFAULT 0,
    total_uploads INTEGER DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    total_successes INTEGER DEFAULT 0,
    total_failures INTEGER DEFAULT 0,
    total_files_processed INTEGER DEFAULT 0,
    total_processing_time_ms BIGINT DEFAULT 0,
    most_used_tool TEXT,
    tools_usage JSONB DEFAULT '{}', -- breakdown by tool
    file_types JSONB DEFAULT '{}', -- breakdown by file type/extension
    average_processing_time_ms INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00, -- percentage
    storage_used_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own reports" ON public.analysis_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports" ON public.analysis_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analysis_reports_user_id ON public.analysis_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_report_type ON public.analysis_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_created_at ON public.analysis_reports(created_at DESC);

-- ==========================================
-- 4. FUNCTIONS FOR AUTOMATIC PROFILE CREATION
-- ==========================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 5. FUNCTIONS FOR ANALYTICS
-- ==========================================

-- Function to generate user analytics report
CREATE OR REPLACE FUNCTION public.generate_user_report(
    p_user_id UUID,
    p_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    p_period_end TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    p_report_type TEXT DEFAULT 'monthly'
)
RETURNS UUID AS $$
DECLARE
    v_report_id UUID;
    v_total_logins INTEGER;
    v_total_uploads INTEGER;
    v_total_downloads INTEGER;
    v_total_successes INTEGER;
    v_total_failures INTEGER;
    v_total_files INTEGER;
    v_total_time BIGINT;
    v_most_used_tool TEXT;
    v_tools_usage JSONB;
    v_file_types JSONB;
    v_avg_time INTEGER;
    v_success_rate DECIMAL(5,2);
BEGIN
    -- Calculate metrics
    SELECT
        COUNT(*) FILTER (WHERE action_type = 'login') INTO v_total_logins
    FROM user_activities
    WHERE user_id = p_user_id
        AND created_at BETWEEN p_period_start AND p_period_end;

    SELECT
        COUNT(*) FILTER (WHERE action_type = 'upload') INTO v_total_uploads
    FROM user_activities
    WHERE user_id = p_user_id
        AND created_at BETWEEN p_period_start AND p_period_end;

    SELECT
        COUNT(*) FILTER (WHERE action_type = 'download') INTO v_total_downloads
    FROM user_activities
    WHERE user_id = p_user_id
        AND created_at BETWEEN p_period_start AND p_period_end;

    SELECT
        COUNT(*) FILTER (WHERE success = true) INTO v_total_successes,
        COUNT(*) FILTER (WHERE success = false) INTO v_total_failures,
        COUNT(*) INTO v_total_files,
        COALESCE(SUM(processing_time_ms), 0) INTO v_total_time
    FROM user_activities
    WHERE user_id = p_user_id
        AND action_type IN ('upload', 'tool_use')
        AND created_at BETWEEN p_period_start AND p_period_end;

    -- Most used tool
    SELECT tool_name INTO v_most_used_tool
    FROM user_activities
    WHERE user_id = p_user_id
        AND tool_name IS NOT NULL
        AND created_at BETWEEN p_period_start AND p_period_end
    GROUP BY tool_name
    ORDER BY COUNT(*) DESC
    LIMIT 1;

    -- Tools usage breakdown
    SELECT jsonb_object_agg(tool_name, usage_count) INTO v_tools_usage
    FROM (
        SELECT tool_name, COUNT(*) as usage_count
        FROM user_activities
        WHERE user_id = p_user_id
            AND tool_name IS NOT NULL
            AND created_at BETWEEN p_period_start AND p_period_end
        GROUP BY tool_name
    ) t;

    -- File types breakdown (assuming file_name contains extension)
    SELECT jsonb_object_agg(file_type, type_count) INTO v_file_types
    FROM (
        SELECT
            CASE
                WHEN file_name LIKE '%.pdf' THEN 'pdf'
                WHEN file_name LIKE '%.doc%' THEN 'word'
                WHEN file_name LIKE '%.xls%' THEN 'excel'
                WHEN file_name LIKE '%.ppt%' THEN 'powerpoint'
                WHEN file_name LIKE '%.jpg' OR file_name LIKE '%.jpeg' OR file_name LIKE '%.png' THEN 'image'
                ELSE 'other'
            END as file_type,
            COUNT(*) as type_count
        FROM user_activities
        WHERE user_id = p_user_id
            AND file_name IS NOT NULL
            AND created_at BETWEEN p_period_start AND p_period_end
        GROUP BY file_type
    ) t;

    -- Calculate averages
    v_avg_time := CASE WHEN v_total_files > 0 THEN (v_total_time / v_total_files)::INTEGER ELSE 0 END;
    v_success_rate := CASE WHEN (v_total_successes + v_total_failures) > 0
        THEN ((v_total_successes::DECIMAL / (v_total_successes + v_total_failures)) * 100)::DECIMAL(5,2)
        ELSE 0.00 END;

    -- Insert report
    INSERT INTO analysis_reports (
        user_id, report_type, report_period_start, report_period_end,
        total_logins, total_uploads, total_downloads, total_successes, total_failures,
        total_files_processed, total_processing_time_ms, most_used_tool, tools_usage,
        file_types, average_processing_time_ms, success_rate
    ) VALUES (
        p_user_id, p_report_type, p_period_start, p_period_end,
        v_total_logins, v_total_uploads, v_total_downloads, v_total_successes, v_total_failures,
        v_total_files, v_total_time, v_most_used_tool, COALESCE(v_tools_usage, '{}'),
        COALESCE(v_file_types, '{}'), v_avg_time, v_success_rate
    ) RETURNING id INTO v_report_id;

    RETURN v_report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 6. VIEWS FOR EASY QUERYING
-- ==========================================

-- View for user statistics
CREATE OR REPLACE VIEW public.user_stats AS
SELECT
    p.id as user_id,
    p.email,
    p.created_at as user_created_at,
    COUNT(ua.id) FILTER (WHERE ua.action_type = 'login') as total_logins,
    COUNT(ua.id) FILTER (WHERE ua.action_type = 'upload') as total_uploads,
    COUNT(ua.id) FILTER (WHERE ua.action_type IN ('upload', 'tool_use')) as total_files_processed,
    COUNT(ua.id) FILTER (WHERE ua.success = true) as total_successes,
    COUNT(ua.id) FILTER (WHERE ua.success = false) as total_failures,
    ROUND(
        CASE WHEN COUNT(ua.id) FILTER (WHERE ua.action_type IN ('upload', 'tool_use')) > 0
        THEN (COUNT(ua.id) FILTER (WHERE ua.success = true)::DECIMAL /
              COUNT(ua.id) FILTER (WHERE ua.action_type IN ('upload', 'tool_use'))) * 100
        ELSE 0 END, 2
    ) as success_rate_percentage,
    COALESCE(AVG(ua.processing_time_ms) FILTER (WHERE ua.processing_time_ms IS NOT NULL), 0) as avg_processing_time_ms,
    COALESCE(SUM(ua.file_size_bytes), 0) as total_file_size_bytes
FROM public.profiles p
LEFT JOIN public.user_activities ua ON p.id = ua.user_id
GROUP BY p.id, p.email, p.created_at;

-- Grant access to authenticated users
GRANT SELECT ON public.user_stats TO authenticated;

-- ==========================================
-- SETUP COMPLETE
-- ==========================================

-- Note: After running this script, you may want to:
-- 1. Test user registration to ensure profiles are created automatically
-- 2. Insert some sample data to test the analytics functions
-- 3. Set up any additional RLS policies if needed
-- 4. Consider setting up database backups and monitoring

-- Example usage of the analytics function:
-- SELECT generate_user_report(auth.uid(), NOW() - INTERVAL '7 days', NOW(), 'weekly');
