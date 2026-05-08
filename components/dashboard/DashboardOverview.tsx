'use client';

import React, { useState, useMemo } from 'react';
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
  const currentFilters = useMemo(() => ({
    ...filters,
    ...(selectedStatus && { status: selectedStatus }),
    ...(selectedPriority && { priority: selectedPriority }),
  }), [filters, selectedStatus, selectedPriority]);
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)] px-4 py-6 lg:px-8">
        {/* Sidebar */}
        <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/20">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">LAMT Analytics</p>
            <h2 className="mt-4 text-2xl font-bold text-white">Demand Intelligence</h2>
            <p className="mt-3 text-sm text-slate-400">
              Executive view of open demand requests, risk, and operational load.
            </p>
          </div>

          <div className="space-y-4 border-t border-slate-800 pt-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Active requests</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stats.total}</p>
              <p className="mt-2 text-sm text-slate-400">Total requests in the system</p>
            </div>
            <div className="grid gap-3">
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Critical</p>
                <p className="mt-3 text-2xl font-semibold text-rose-400">{stats.critical}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Delayed</p>
                <p className="mt-3 text-2xl font-semibold text-amber-300">{stats.delayed}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Navigation</p>
            <nav className="mt-4 space-y-2">
              {['Overview', 'Requests', 'Analytics', 'Notifications', 'Settings'].map((item) => (
                <button
                  key={item}
                  className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="space-y-6">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/20">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
                <h1 className="mt-3 text-3xl font-bold text-white">AI Demand Request Dashboard</h1>
                <p className="mt-2 text-slate-400">
                  Welcome, {user.name || user.email} • {user.role.replace('_', ' ').toUpperCase()}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700">
                  Export
                </button>
                <button className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                  Share insights
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-6">
            <StatusCard label="Total" value={stats.total} color="blue" icon="📊" />
            <StatusCard label="Pending" value={stats.pending} color="yellow" icon="⏳" />
            <StatusCard label="In Progress" value={stats.in_progress} color="blue" icon="⚙️" />
            <StatusCard label="Completed" value={stats.completed} color="green" icon="✅" />
            <StatusCard label="Delayed" value={stats.delayed} color="red" icon="🔴" />
            <StatusCard label="Critical" value={stats.critical} color="purple" icon="🚨" />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/15">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Performance</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">Demand velocity</h2>
                </div>
                <span className="rounded-2xl bg-slate-800 px-3 py-2 text-sm text-slate-300">
                  Last 30 days
                </span>
              </div>

              <div className="mt-8 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Pending</span>
                    <span>25%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-3/5 rounded-full bg-cyan-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>In Progress</span>
                    <span>17%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-2/5 rounded-full bg-blue-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Completed</span>
                    <span>49%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-1/2 rounded-full bg-emerald-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Delayed</span>
                    <span>9%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-1/5 rounded-full bg-rose-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/15">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">AI Insights</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">Actionable alerts</h2>
                </div>
                <span className="text-sm text-slate-400">Updated just now</span>
              </div>

              <div className="mt-6 space-y-3">
                {insights.length > 0 ? (
                  insights.map((insight, idx) => (
                    <InsightItem key={idx} type={insight.type} message={insight.message} />
                  ))
                ) : (
                  <p className="text-slate-400">No insights available</p>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-800 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Requests</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">Demand requests table</h2>
                </div>
                <button className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Add request
                </button>
              </div>

              <div className="mt-6">
                <DemandTable demands={demands} loading={demandsLoading} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-800 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Filters</p>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900"
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
                    <label className="text-sm font-medium text-slate-700">Priority</label>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900"
                    >
                      <option value="">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedStatus('');
                      setSelectedPriority('');
                    }}
                    className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Reset filters
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Timeline</p>
                <div className="mt-4 space-y-4 text-sm text-slate-700">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span>New request created</span>
                    <span className="text-slate-500">2h ago</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span>Critical request escalated</span>
                    <span className="text-slate-500">4h ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Weekly review ready</span>
                    <span className="text-slate-500">1d ago</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
