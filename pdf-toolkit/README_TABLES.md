# Supabase Tables Setup Guide

## 📋 Tables Created

This setup creates three main tables for your PDF Toolkit:

### 1. `profiles` Table
- **Purpose**: Extends Supabase auth.users with additional user information
- **Fields**: id, email, full_name, avatar_url, timestamps
- **Auto-created**: When users sign up via trigger

### 2. `user_activities` Table
- **Purpose**: Tracks all user actions and tool usage
- **Tracks**:
  - User logins/logouts
  - File uploads and downloads
  - Tool usage (compress, merge, split, etc.)
  - Success/failure status
  - Processing times
  - File metadata

### 3. `analysis_reports` Table
- **Purpose**: Stores comprehensive analytics reports
- **Includes**:
  - Total logins, uploads, downloads
  - Success rates and failure counts
  - Most used tools
  - File type breakdowns
  - Processing time analytics

## 🚀 How to Run the Setup

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your PDF Toolkit project

### Step 2: Open SQL Editor
1. In the left sidebar, click **"SQL Editor"**
2. Click **"New Query"** to open a new SQL tab

### Step 3: Run the Script
1. Copy the entire content from `create_supabase_tables.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** or press **Ctrl+Enter**

### Step 4: Verify Setup
After running the script, you should see:
- ✅ No errors in the output
- ✅ Tables created successfully
- ✅ Functions and triggers created

## 🔍 Testing the Setup

### Test User Registration
1. Try signing up a new user in your app
2. Check that a profile is automatically created in the `profiles` table

### Test Activity Tracking
You'll need to update your app code to log activities. Here are the key functions to add:

```javascript
// In your supabase.js or create a new utils/analytics.js

// Log user login
export const logUserLogin = async (userId) => {
  const supabase = getSupabase();
  return await supabase.from('user_activities').insert({
    user_id: userId,
    action_type: 'login'
  });
};

// Log file upload
export const logFileUpload = async (userId, fileName, fileSize) => {
  const supabase = getSupabase();
  return await supabase.from('user_activities').insert({
    user_id: userId,
    action_type: 'upload',
    file_name: fileName,
    file_size_bytes: fileSize
  });
};

// Log tool usage
export const logToolUsage = async (userId, toolName, fileName, success, processingTime, metadata = {}) => {
  const supabase = getSupabase();
  return await supabase.from('user_activities').insert({
    user_id: userId,
    action_type: 'tool_use',
    tool_name: toolName,
    file_name: fileName,
    success: success,
    processing_time_ms: processingTime,
    metadata: metadata
  });
};

// Generate user report
export const generateUserReport = async (userId, periodStart, periodEnd, reportType = 'monthly') => {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc('generate_user_report', {
    p_user_id: userId,
    p_period_start: periodStart,
    p_period_end: periodEnd,
    p_report_type: reportType
  });
  return { data, error };
};

// Get user stats
export const getUserStats = async (userId) => {
  const supabase = getSupabase();
  return await supabase.from('user_stats').select('*').eq('user_id', userId).single();
};
```

## 📊 Available Analytics

### Real-time Stats via View
```sql
SELECT * FROM user_stats WHERE user_id = 'your-user-id';
```

### Generate Reports
```sql
-- Generate weekly report
SELECT generate_user_report('user-id', NOW() - INTERVAL '7 days', NOW(), 'weekly');

-- Generate monthly report
SELECT generate_user_report('user-id', NOW() - INTERVAL '30 days', NOW(), 'monthly');
```

### Query Activity Data
```sql
-- Total uploads this month
SELECT COUNT(*) as uploads_this_month
FROM user_activities
WHERE user_id = 'your-user-id'
  AND action_type = 'upload'
  AND created_at >= NOW() - INTERVAL '30 days';

-- Success rate by tool
SELECT tool_name,
       COUNT(*) as total_uses,
       ROUND(AVG(CASE WHEN success THEN 100 ELSE 0 END), 2) as success_rate
FROM user_activities
WHERE user_id = 'your-user-id'
  AND tool_name IS NOT NULL
GROUP BY tool_name
ORDER BY total_uses DESC;
```

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Automatic Profile Creation**: Profiles are created when users sign up
- **Data Validation**: Check constraints ensure data integrity
- **Indexes**: Optimized for common query patterns

## 🛠️ Maintenance

### View Table Structure
In Supabase Dashboard → Table Editor, you can see all tables and their structures.

### Monitor Usage
Check the `user_activities` table regularly to monitor app usage and identify popular tools.

### Backup Data
Supabase automatically backs up your data, but consider exporting reports periodically.

## ❓ Troubleshooting

### Script Fails to Run
- Check for syntax errors in the SQL
- Ensure you have proper permissions in your Supabase project
- Try running smaller sections of the script individually

### RLS Blocking Queries
- Make sure you're authenticated when testing
- Check that policies are correctly applied

### Functions Not Working
- Verify function creation in Supabase Dashboard → Database → Functions
- Check function permissions and security settings

## 📞 Need Help?

If you encounter issues:
1. Check the Supabase logs in Dashboard → Logs
2. Verify your project settings
3. Ensure your app is properly configured with the correct Supabase URL and keys

The tables are now ready to track all user activities and provide comprehensive analytics for your PDF Toolkit!
