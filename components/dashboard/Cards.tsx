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
    <div className={`p-4 border rounded-lg ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        {icon && <span className="text-4xl">{icon}</span>}
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
    up: '📈',
    down: '📉',
    stable: '➡️',
  }[trend || 'stable'];

  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-2xl font-bold">{value}</p>
        <span className="text-xl">{trendIcon}</span>
      </div>
      {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
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
