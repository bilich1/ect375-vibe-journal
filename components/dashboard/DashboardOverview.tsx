'use client';

import React, { useState } from 'react';
import { useDemands, DemandFilters } from '@/lib/hooks/useDemands';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { useAuthContext } from '@/lib/auth/AuthContext';
import { ProtectedComponent } from '@/components/auth/ProtectedComponent';
import { StatusCard, MetricCard, InsightItem } from '@/components/dashboard/Cards';
import { DemandTable } from '@/components/dashboard/DemandTable';

export function DashboardOverview() {
  const { user, loading: authLoading } = useAuthContext();
  const [filters, setFilters] = useState<DemandFilters>({});
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');

  const { analytics, loading: analyticsLoading } = useAnalytics('overview', 30);
  const currentFilters = {
    ...filters,
    ...(selectedStatus && { status: selectedStatus }),
    ...(selectedPriority && { priority: selectedPriority }),
  };
  const { demands, loading: demandsLoading } = useDemands(currentFilters);

  if (authLoading) {
    return <div className="p-8 text-center">Loading user data...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-red-600">Please log in to view the dashboard</div>;
  }

  const stats = analytics?.summary || {
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    delayed: 0,
    critical: 0,
  };

  const insights = analytics?.insights || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Demand Request Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome, {user.name || user.email} • {user.role.replace('_', ' ').toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Summary Cards */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatusCard label="Total" value={stats.total} color="blue" icon="📊" />
            <StatusCard label="Pending" value={stats.pending} color="yellow" icon="⏳" />
            <StatusCard label="In Progress" value={stats.in_progress} color="blue" icon="⚙️" />
            <StatusCard label="Completed" value={stats.completed} color="green" icon="✅" />
            <StatusCard label="Delayed" value={stats.delayed} color="red" icon="🔴" />
            <StatusCard label="Critical" value={stats.critical} color="purple" icon="🚨" />
          </div>
        </section>

        {/* Insights Section */}
        <ProtectedComponent requiredPermission="viewAnomalies">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">AI Insights</h2>
            <div className="space-y-2">
              {insights.length > 0 ? (
                insights.map((insight, idx) => (
                  <InsightItem
                    key={idx}
                    type={insight.type}
                    message={insight.message}
                  />
                ))
              ) : (
                <p className="text-gray-500">No insights available</p>
              )}
            </div>
          </section>
        </ProtectedComponent>

        {/* Filters */}
        <section className="mb-8 bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={() => {
                  setSelectedStatus('');
                  setSelectedPriority('');
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </section>

        {/* Demands Table */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Demand Requests</h2>
          <DemandTable
            demands={demands}
            loading={demandsLoading}
          />
        </section>
      </div>
    </div>
  );
}
