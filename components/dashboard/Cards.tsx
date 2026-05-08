'use client';

import React from 'react';

interface StatusCardProps {
  label: string;
  value: number;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  icon?: string;
}

const colorMap = {
  blue: 'bg-blue-100 text-blue-800 border-blue-300',
  green: 'bg-green-100 text-green-800 border-green-300',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  red: 'bg-red-100 text-red-800 border-red-300',
  purple: 'bg-purple-100 text-purple-800 border-purple-300',
};

export function StatusCard({ label, value, color, icon }: StatusCardProps) {
  return (
    <div className={`rounded-3xl border p-5 shadow-sm transition hover:shadow-lg ${colorMap[color]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">{label}</p>
          <p className="mt-4 text-4xl font-bold text-slate-950">{value}</p>
        </div>
        {icon && <span className="text-5xl leading-none">{icon}</span>}
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
}

export function MetricCard({ title, value, subtitle, trend }: MetricCardProps) {
  const trendIcon = {
    up: '↑',
    down: '↓',
    stable: '→',
  }[trend || 'stable'];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</p>
          <p className="mt-4 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        {trend && (
          <span className={`rounded-2xl px-3 py-2 text-sm font-semibold ${trend === 'up' ? 'bg-emerald-100 text-emerald-700' : trend === 'down' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
            {trendIcon}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-4 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}

interface InsightItemProps {
  type: 'warning' | 'alert' | 'info';
  message: string;
}

export function InsightItem({ type, message }: InsightItemProps) {
  const typeConfig = {
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-300', icon: '⚠️' },
    alert: { bg: 'bg-red-50', border: 'border-red-300', icon: '🚨' },
    info: { bg: 'bg-blue-50', border: 'border-blue-300', icon: 'ℹ️' },
  };

  const config = typeConfig[type];

  return (
    <div className={`p-3 border rounded ${config.bg} ${config.border}`}>
      <div className="flex gap-2">
        <span className="text-lg">{config.icon}</span>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
