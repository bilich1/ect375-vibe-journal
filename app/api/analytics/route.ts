import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { AIInsightsEngine } from '@/lib/analytics/insightsEngine';

export const dynamic = 'force-dynamic';

/**
 * Analytics endpoint for trend analysis, anomaly detection, and insights
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric') || 'overview';
    const days = parseInt(searchParams.get('days') || '30');

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    let query = supabase
      .from('demand_requests')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Process analytics based on metric
    const analytics = calculateAnalytics(data, metric, days);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

interface DemandRequest {
  id: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  due_date: string | null;
  completed_at: string | null;
}

function calculateAnalytics(
  requests: DemandRequest[],
  metric: string,
  days: number
) {
  if (metric === 'overview') {
    return {
      summary: {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        in_progress: requests.filter(r => r.status === 'in_progress').length,
        completed: requests.filter(r => r.status === 'completed').length,
        delayed: requests.filter(r => r.status === 'delayed').length,
        critical: requests.filter(r => r.priority === 'critical').length,
      },
      trend: {
        by_priority: groupBy(requests, 'priority'),
        by_status: groupBy(requests, 'status'),
        by_category: groupBy(requests, 'category'),
      },
      insights: detectAnomalies(requests),
    };
  }

  if (metric === 'trends') {
    return {
      daily_trend: calculateDailyTrend(requests),
      weekly_avg: calculateWeeklyMetrics(requests),
    };
  }

  if (metric === 'performance') {
    return {
      completion_rate: calculateCompletionRate(requests),
      avg_resolution_time: calculateAvgResolutionTime(requests),
      priority_distribution: groupBy(requests, 'priority'),
    };
  }

  return { error: 'Unknown metric' };
}

function groupBy(requests: DemandRequest[], key: string) {
  const grouped: Record<string, number> = {};
  requests.forEach(r => {
    const val = (r as any)[key];
    grouped[val] = (grouped[val] || 0) + 1;
  });
  return grouped;
}

function detectAnomalies(requests: DemandRequest[]) {
  // Use AI Insights Engine for sophisticated analysis
  const engine = new AIInsightsEngine(requests, 30);
  const insights = engine.analyze();

  // Convert to simpler format for frontend
  return insights.map(insight => ({
    type: insight.type,
    message: `${insight.title}: ${insight.message}`,
    value: insight.metric || 0,
  }));
}

function calculateDailyTrend(requests: DemandRequest[]) {
  const trend: Record<string, number> = {};
  requests.forEach(r => {
    const date = new Date(r.created_at).toLocaleDateString();
    trend[date] = (trend[date] || 0) + 1;
  });
  return trend;
}

function calculateWeeklyMetrics(requests: DemandRequest[]) {
  const weeks: Record<number, number> = {};
  requests.forEach(r => {
    const date = new Date(r.created_at);
    const week = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    );
    weeks[week] = (weeks[week] || 0) + 1;
  });
  return weeks;
}

function calculateCompletionRate(requests: DemandRequest[]) {
  const completed = requests.filter(r => r.status === 'completed').length;
  return requests.length > 0 ? ((completed / requests.length) * 100).toFixed(1) : '0';
}

function calculateAvgResolutionTime(requests: DemandRequest[]) {
  const completed = requests.filter(
    r => r.status === 'completed' && r.completed_at
  );

  if (completed.length === 0) return 0;

  const totalTime = completed.reduce((sum, r) => {
    const start = new Date(r.created_at).getTime();
    const end = new Date(r.completed_at!).getTime();
    return sum + (end - start);
  }, 0);

  // Return average in days
  return (totalTime / completed.length / (1000 * 60 * 60 * 24)).toFixed(1);
}
