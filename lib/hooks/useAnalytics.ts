'use client';

import { useEffect, useState } from 'react';

export interface Insight {
  type: 'warning' | 'alert' | 'info';
  message: string;
  value: number;
}

export interface AnalyticsData {
  summary?: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    delayed: number;
    critical: number;
  };
  trend?: Record<string, number>;
  insights?: Insight[];
  daily_trend?: Record<string, number>;
  weekly_avg?: Record<number, number>;
  completion_rate?: string;
  avg_resolution_time?: string;
}

export function useAnalytics(metric: string = 'overview', days: number = 30) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          metric,
          days: days.toString(),
        });

        const response = await fetch(`/api/analytics?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const result = await response.json();
        setAnalytics(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [metric, days]);

  return { analytics, loading, error };
}
