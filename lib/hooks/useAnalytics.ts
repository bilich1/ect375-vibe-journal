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

        // Check for test mode
        const testMode = localStorage.getItem('test_mode');
        if (testMode === 'true') {
          // Return mock analytics data for test mode
          const mockAnalytics: AnalyticsData = {
            summary: {
              total: 47,
              pending: 12,
              in_progress: 8,
              completed: 23,
              delayed: 4,
              critical: 3
            },
            trend: {
              '2024-01-01': 5,
              '2024-01-02': 8,
              '2024-01-03': 12,
              '2024-01-04': 15,
              '2024-01-05': 7
            },
            insights: [
              {
                type: 'alert',
                message: 'Critical priority requests have increased by 25% this week',
                value: 25
              },
              {
                type: 'warning',
                message: 'Average resolution time is 2 days above target',
                value: 2
              },
              {
                type: 'info',
                message: 'IT Infrastructure category shows highest demand',
                value: 35
              }
            ],
            daily_trend: {
              '2024-01-01': 5,
              '2024-01-02': 8,
              '2024-01-03': 12,
              '2024-01-04': 15,
              '2024-01-05': 7
            },
            weekly_avg: {
              1: 8,
              2: 12,
              3: 15,
              4: 12
            },
            completion_rate: '78%',
            avg_resolution_time: '4.2 days'
          };

          setAnalytics(mockAnalytics);
          setError(null);
          setLoading(false);
          return;
        }

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
