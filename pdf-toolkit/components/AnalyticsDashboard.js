"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import {
  getUserStats,
  getActivitySummary,
  getRecentActivities,
  formatFileSize,
  formatProcessingTime,
  getActivityIcon,
  getToolDisplayName
} from '../utils/analytics';
import {
  ChartBarIcon,
  ClockIcon,
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [statsData, summaryData, activitiesData] = await Promise.all([
        getUserStats(user.id),
        getActivitySummary(user.id, 30),
        getRecentActivities(user.id, 10)
      ]);

      if (statsData.data) setStats(statsData.data);
      if (summaryData.data) setSummary(summaryData.data);
      if (activitiesData.data) setRecentActivities(activitiesData.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <div className="flex items-center mt-1">
              {trend > 0 ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <Icon className={`h-8 w-8 text-${color}-600`} />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your PDF processing activity and usage statistics
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'activities', name: 'Recent Activities' },
            { id: 'tools', name: 'Tool Usage' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Logins"
              value={stats?.total_logins || 0}
              icon={ChartBarIcon}
              color="blue"
            />
            <StatCard
              title="Files Uploaded"
              value={stats?.total_uploads || 0}
              icon={DocumentIcon}
              color="green"
            />
            <StatCard
              title="Files Processed"
              value={stats?.total_files_processed || 0}
              icon={CheckCircleIcon}
              color="purple"
            />
            <StatCard
              title="Success Rate"
              value={`${stats?.success_rate_percentage || 0}%`}
              icon={stats?.success_rate_percentage >= 80 ? CheckCircleIcon : XCircleIcon}
              color={stats?.success_rate_percentage >= 80 ? "green" : "red"}
            />
          </div>

          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Activity Summary (Last 30 Days)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Activities</span>
                    <span className="font-medium">{summary.total_activities}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Logins</span>
                    <span className="font-medium">{summary.logins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Uploads</span>
                    <span className="font-medium">{summary.uploads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tool Uses</span>
                    <span className="font-medium">{summary.tool_uses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                    <span className="font-medium">{summary.success_rate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg Processing Time</span>
                    <span className="font-medium">{formatProcessingTime(stats?.avg_processing_time_ms)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Storage Used
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatFileSize(stats?.total_file_size_bytes)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Total file size processed
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activities Tab */}
      {activeTab === 'activities' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activities
            </h3>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No recent activities found
                </p>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getActivityIcon(activity.action_type)}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {activity.action_type === 'tool_use'
                            ? getToolDisplayName(activity.tool_name)
                            : activity.action_type.charAt(0).toUpperCase() + activity.action_type.slice(1)
                          }
                        </p>
                        {activity.file_name && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {activity.file_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        activity.success === true
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : activity.success === false
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {activity.success === true ? 'Success' : activity.success === false ? 'Failed' : 'Pending'}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                      {activity.processing_time_ms && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatProcessingTime(activity.processing_time_ms)}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tools Tab */}
      {activeTab === 'tools' && summary && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tool Usage Breakdown
            </h3>
            {Object.keys(summary.tool_breakdown).length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No tool usage data available
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(summary.tool_breakdown)
                  .sort(([,a], [,b]) => b.total - a.total)
                  .map(([toolName, data]) => (
                    <div key={toolName} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🔧</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {getToolDisplayName(toolName)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {data.total} total uses
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-600">
                              {data.successes}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Success
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-red-600">
                              {data.failures}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Failed
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-blue-600">
                              {data.total > 0 ? Math.round((data.successes / data.total) * 100) : 0}%
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Success Rate
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
