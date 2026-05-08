'use client';

import React from 'react';

interface TrendPoint {
  label: string;
  value: number;
  color: string;
}

interface TrendChartProps {
  title: string;
  subtitle: string;
  data: TrendPoint[];
}

export function TrendChart({ title, subtitle, data }: TrendChartProps) {
  const maxValue = Math.max(...data.map((point) => point.value), 1);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Trend analysis</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700">Live</div>
      </div>
      <div className="mt-8 space-y-4">
        {data.map((point) => (
          <div key={point.label}>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{point.label}</span>
              <span className="font-semibold text-slate-900">{point.value}</span>
            </div>
            <div className="mt-2 h-4 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${point.color}`}
                style={{ width: `${(point.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
