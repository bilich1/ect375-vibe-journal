'use client';

import React, { useState, useMemo } from 'react';
import { useDemands, DemandFilters } from '@/lib/hooks/useDemands';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { useAuthContext } from '@/lib/auth/AuthContext';
import { ProtectedComponent } from '@/components/auth/ProtectedComponent';
import { StatusCard, MetricCard, InsightItem } from '@/components/dashboard/Cards';
import { DemandTable } from '@/components/dashboard/DemandTable';
import { TrendChart } from '@/components/dashboard/TrendChart';

export function DashboardOverview() {
  const { user, loading: authLoading } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'analytics' | 'notifications' | 'settings'>('overview');
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
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-8 text-white shadow-2xl shadow-slate-900/20">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">LAMT Analytics</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight">Demand Intelligence</h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Executive view of open demand requests, risk, and operational load across the enterprise.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="rounded-2xl border border-slate-600 bg-slate-950 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition hover:bg-slate-900">
                Export
              </button>
              <button className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 transition hover:bg-cyan-300">
                Share insights
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Welcome back</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">{user.name || user.email}</h2>
                <p className="mt-2 text-sm text-slate-600">{user.role.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div className="mt-8 grid gap-3">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'requests', label: 'Requests' },
                  { id: 'analytics', label: 'Analytics' },
                  { id: 'notifications', label: 'Notifications' },
                  { id: 'settings', label: 'Settings' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium transition ${
                      activeTab === tab.id
                        ? 'bg-slate-200 text-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Quick summary</p>
              <div className="mt-5 space-y-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Critical</p>
                  <p className="mt-2 text-3xl font-semibold text-rose-600">{stats.critical}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Delayed</p>
                  <p className="mt-2 text-3xl font-semibold text-amber-600">{stats.delayed}</p>
                </div>
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            {activeTab === 'overview' && (
              <>
                <section className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">KPI Overview</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">High level metrics</h2>
                  </div>
                  <span className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-600">Today</span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatusCard label="Total" value={stats.total} color="blue" icon="📊" />
                  <StatusCard label="Pending" value={stats.pending} color="yellow" icon="⏳" />
                  <StatusCard label="Completed" value={stats.completed} color="green" icon="✅" />
                  <StatusCard label="Critical" value={stats.critical} color="purple" icon="🚨" />
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">AI Insights</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">Actionable alerts</h2>
                  </div>
                  <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700">Live update</span>
                </div>
                <div className="mt-6 space-y-3">
                  {insights.length > 0 ? (
                    insights.map((insight, idx) => (
                      <InsightItem key={idx} type={insight.type} message={insight.message} />
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No insights available</p>
                  )}
                </div>
              </div>
            </section>

            <TrendChart
              title="Weekly demand trend"
              subtitle="Requests processed over the last 5 business days"
              data={[
                { label: 'Mon', value: 32, color: 'bg-cyan-500' },
                { label: 'Tue', value: 54, color: 'bg-emerald-500' },
                { label: 'Wed', value: 63, color: 'bg-sky-500' },
                { label: 'Thu', value: 42, color: 'bg-indigo-500' },
                { label: 'Fri', value: 77, color: 'bg-rose-500' },
              ]}
            />

            <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Activity</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Demand distribution</h2>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-700">
                    Updated now
                  </div>
                </div>
                <div className="mt-6 space-y-6">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                      <span>Pending</span>
                      <span>{stats.pending} requests</span>
                    </div>
                    <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-2/5 rounded-full bg-amber-400" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                      <span>In Progress</span>
                      <span>{stats.in_progress} requests</span>
                    </div>
                    <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-1/4 rounded-full bg-sky-500" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                      <span>Completed</span>
                      <span>{stats.completed} requests</span>
                    </div>
                    <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-1/2 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                      <span>Delayed</span>
                      <span>{stats.delayed} requests</span>
                    </div>
                    <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-1/5 rounded-full bg-rose-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <MetricCard title="Resolution rate" value="78%" subtitle="Compared to last week" trend="up" />
                <MetricCard title="Average time" value="4.2 days" subtitle="Current SLA performance" trend="stable" />
                <MetricCard title="Backlog risk" value="12%" subtitle="High-priority backlog" trend="down" />
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Requests</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Demand request table</h2>
                </div>
                <div className="grid gap-3 sm:auto-cols-max sm:grid-flow-col">
                  <button className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">
                    Export
                  </button>
                  <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Add request
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <DemandTable demands={demands} loading={demandsLoading} />
              </div>
            </section>
              </>
            )}

            {activeTab === 'requests' && (
              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">All Requests</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Demand request management</h2>
                  </div>
                  <div className="grid gap-3 sm:auto-cols-max sm:grid-flow-col">
                    <button className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">
                      Export
                    </button>
                    <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                      Add request
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <DemandTable demands={demands} loading={demandsLoading} />
                </div>
              </section>
            )}

            {['analytics', 'notifications', 'settings'].includes(activeTab) && (
              <section className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900 capitalize">{activeTab}</h2>
                <p className="mt-2 text-slate-500">This section is currently under construction.</p>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
