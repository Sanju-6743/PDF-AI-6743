// Analytics utility for tracking user activities and generating reports
import { getSupabase } from '../lib/supabase.js';

// ==========================================
// ACTIVITY LOGGING FUNCTIONS
// ==========================================

// Log user login
export const logUserLogin = async (userId) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('user_activities').insert({
      user_id: userId,
      action_type: 'login'
    });
    if (error) console.error('Error logging login:', error);
    return { error };
  } catch (error) {
    console.error('Error logging login:', error);
    return { error };
  }
};

// Log user logout
export const logUserLogout = async (userId) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('user_activities').insert({
      user_id: userId,
      action_type: 'logout'
    });
    if (error) console.error('Error logging logout:', error);
    return { error };
  } catch (error) {
    console.error('Error logging logout:', error);
    return { error };
  }
};

// Log file upload
export const logFileUpload = async (userId, fileName, fileSize) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('user_activities').insert({
      user_id: userId,
      action_type: 'upload',
      file_name: fileName,
      file_size_bytes: fileSize
    });
    if (error) console.error('Error logging upload:', error);
    return { error };
  } catch (error) {
    console.error('Error logging upload:', error);
    return { error };
  }
};

// Log file download
export const logFileDownload = async (userId, fileName, fileSize = null) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('user_activities').insert({
      user_id: userId,
      action_type: 'download',
      file_name: fileName,
      file_size_bytes: fileSize
    });
    if (error) console.error('Error logging download:', error);
    return { error };
  } catch (error) {
    console.error('Error logging download:', error);
    return { error };
  }
};

// Log tool usage
export const logToolUsage = async (userId, toolName, fileName, success, processingTime, metadata = {}) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('user_activities').insert({
      user_id: userId,
      action_type: 'tool_use',
      tool_name: toolName,
      file_name: fileName,
      success: success,
      processing_time_ms: processingTime,
      metadata: metadata
    });
    if (error) console.error('Error logging tool usage:', error);
    return { error };
  } catch (error) {
    console.error('Error logging tool usage:', error);
    return { error };
  }
};

// ==========================================
// REPORT GENERATION FUNCTIONS
// ==========================================

// Generate user report
export const generateUserReport = async (userId, periodStart, periodEnd, reportType = 'monthly') => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.rpc('generate_user_report', {
      p_user_id: userId,
      p_period_start: periodStart,
      p_period_end: periodEnd,
      p_report_type: reportType
    });
    if (error) console.error('Error generating report:', error);
    return { data, error };
  } catch (error) {
    console.error('Error generating report:', error);
    return { error };
  }
};

// Get user stats (real-time)
export const getUserStats = async (userId) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) console.error('Error getting user stats:', error);
    return { data, error };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return { error };
  }
};

// Get recent activities
export const getRecentActivities = async (userId, limit = 10) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) console.error('Error getting recent activities:', error);
    return { data, error };
  } catch (error) {
    console.error('Error getting recent activities:', error);
    return { error };
  }
};

// Get activity summary for a period
export const getActivitySummary = async (userId, days = 30) => {
  try {
    const supabase = getSupabase();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('user_activities')
      .select('action_type, success, tool_name, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting activity summary:', error);
      return { data: null, error };
    }

    // Process the data
    const summary = {
      total_activities: data.length,
      logins: data.filter(a => a.action_type === 'login').length,
      uploads: data.filter(a => a.action_type === 'upload').length,
      downloads: data.filter(a => a.action_type === 'download').length,
      tool_uses: data.filter(a => a.action_type === 'tool_use').length,
      successes: data.filter(a => a.success === true).length,
      failures: data.filter(a => a.success === false).length,
      success_rate: data.length > 0 ? ((data.filter(a => a.success === true).length / data.length) * 100).toFixed(1) : 0,
      tool_breakdown: {},
      period_days: days
    };

    // Tool usage breakdown
    data.filter(a => a.tool_name).forEach(activity => {
      if (!summary.tool_breakdown[activity.tool_name]) {
        summary.tool_breakdown[activity.tool_name] = { total: 0, successes: 0, failures: 0 };
      }
      summary.tool_breakdown[activity.tool_name].total++;
      if (activity.success) {
        summary.tool_breakdown[activity.tool_name].successes++;
      } else {
        summary.tool_breakdown[activity.tool_name].failures++;
      }
    });

    return { data: summary, error: null };
  } catch (error) {
    console.error('Error getting activity summary:', error);
    return { error };
  }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return 'N/A';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Format processing time
export const formatProcessingTime = (ms) => {
  if (!ms) return 'N/A';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

// Get activity icon
export const getActivityIcon = (actionType) => {
  switch (actionType) {
    case 'login': return '🔐';
    case 'logout': return '🚪';
    case 'upload': return '📤';
    case 'download': return '📥';
    case 'tool_use': return '🔧';
    default: return '📄';
  }
};

// Get tool display name
export const getToolDisplayName = (toolName) => {
  const toolNames = {
    'compress': 'Compress PDF',
    'merge': 'Merge PDFs',
    'split': 'Split PDF',
    'extract': 'Extract Pages',
    'remove': 'Remove Pages',
    'duplicate': 'Duplicate Pages',
    'watermark': 'Add Watermark',
    'pagenumbers': 'Add Page Numbers',
    'metadata': 'Edit Metadata',
    'crop': 'Crop PDF',
    'background': 'Change Background',
    'unlock': 'Unlock PDF',
    'signature': 'Add Signature',
    'overlay': 'Overlay PDF',
    'protect': 'Protect PDF',
    'images-to-pdf': 'Images to PDF',
    'pdf-to-text': 'PDF to Text',
    'pdf-to-word': 'PDF to Word',
    'extract-fonts': 'Extract Fonts',
    'extract-images': 'Extract Images',
    'redact': 'Redact PDF'
  };
  return toolNames[toolName] || toolName;
};
