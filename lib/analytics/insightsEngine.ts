/**
 * AI Insights Engine for Linde AMT Dashboard
 * Analyzes demand request patterns and provides actionable insights
 */

export interface DemandData {
  id: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  due_date: string | null;
  completed_at: string | null;
}

export interface InsightResult {
  type: 'warning' | 'alert' | 'info' | 'success';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  suggestedAction?: string;
  metric?: number;
  trend?: 'improving' | 'declining' | 'stable';
}

export class AIInsightsEngine {
  private data: DemandData[];
  private timeWindowDays: number;

  constructor(data: DemandData[], timeWindowDays: number = 30) {
    this.data = data;
    this.timeWindowDays = timeWindowDays;
  }

  /**
   * Run all insight analyses
   */
  public analyze(): InsightResult[] {
    const insights: InsightResult[] = [];

    insights.push(...this.detectUrgentBottlenecks());
    insights.push(...this.detectTrendAnomalies());
    insights.push(...this.detectPrioritySkew());
    insights.push(...this.detectCategoryHotspots());
    insights.push(...this.detectPerformanceIssues());
    insights.push(...this.detectStuckRequests());

    return insights.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  /**
   * Detect urgent bottlenecks in the pipeline
   */
  private detectUrgentBottlenecks(): InsightResult[] {
    const insights: InsightResult[] = [];
    const delayed = this.data.filter(d => d.status === 'delayed');
    const critical = this.data.filter(d => d.priority === 'critical');

    if (delayed.length > this.data.length * 0.05) {
      const percentage = Math.round((delayed.length / this.data.length) * 100);
      insights.push({
        type: 'alert',
        title: 'High Delayed Request Rate',
        message: `${percentage}% of requests are delayed. This exceeds the 5% threshold.`,
        severity: 'critical',
        actionable: true,
        suggestedAction: 'Escalate these requests and allocate additional resources.',
        metric: delayed.length,
      });
    }

    if (critical.length > this.data.length * 0.15) {
      insights.push({
        type: 'warning',
        title: 'Critical Request Overload',
        message: `${critical.length} critical-priority requests need immediate attention.`,
        severity: 'high',
        actionable: true,
        suggestedAction: 'Review priority assignments; consider re-categorizing lower-priority items.',
        metric: critical.length,
      });
    }

    return insights;
  }

  /**
   * Detect unusual trends compared to baseline
   */
  private detectTrendAnomalies(): InsightResult[] {
    const insights: InsightResult[] = [];
    const now = new Date();

    // Split data into two periods
    const midpoint = now.getTime() - (this.timeWindowDays / 2) * 24 * 60 * 60 * 1000;
    const recent = this.data.filter(d => new Date(d.created_at).getTime() > midpoint);
    const older = this.data.filter(d => new Date(d.created_at).getTime() <= midpoint);

    if (older.length > 0) {
      const recentRate = recent.length / (this.timeWindowDays / 2);
      const olderRate = older.length / (this.timeWindowDays / 2);
      const percentChange = ((recentRate - olderRate) / olderRate) * 100;

      if (percentChange > 20) {
        insights.push({
          type: 'info',
          title: 'Increasing Demand',
          message: `Request volume increased by ${Math.round(percentChange)}% compared to the previous period.`,
          severity: 'medium',
          actionable: false,
          trend: 'improving',
          metric: Math.round(percentChange),
        });
      } else if (percentChange < -20) {
        insights.push({
          type: 'info',
          title: 'Decreasing Demand',
          message: `Request volume decreased by ${Math.round(Math.abs(percentChange))}%.`,
          severity: 'low',
          actionable: false,
          trend: 'declining',
          metric: Math.round(Math.abs(percentChange)),
        });
      }
    }

    return insights;
  }

  /**
   * Detect if one priority level dominates
   */
  private detectPrioritySkew(): InsightResult[] {
    const insights: InsightResult[] = [];
    const priorityCounts = this.groupBy(this.data, 'priority');
    const total = this.data.length;

    Object.entries(priorityCounts).forEach(([priority, count]) => {
      const percentage = (count / total) * 100;
      if (percentage > 50 && priority !== 'medium') {
        insights.push({
          type: 'warning',
          title: `Priority Skew: ${priority.toUpperCase()}`,
          message: `${Math.round(percentage)}% of requests are marked as ${priority} priority.`,
          severity: priority === 'critical' ? 'high' : 'medium',
          actionable: true,
          suggestedAction: 'Review priority assignments to ensure accurate categorization.',
          metric: count,
        });
      }
    });

    return insights;
  }

  /**
   * Detect categories with unexpectedly high request volumes
   */
  private detectCategoryHotspots(): InsightResult[] {
    const insights: InsightResult[] = [];
    const categoryCounts = this.groupBy(this.data, 'category');
    const total = this.data.length;
    const avgPerCategory = total / Object.keys(categoryCounts).length;

    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count > avgPerCategory * 1.5) {
        const percentage = Math.round((count / total) * 100);
        insights.push({
          type: 'info',
          title: `Category Hotspot: ${category}`,
          message: `${percentage}% of requests are from the ${category} category. This is 50% above average.`,
          severity: 'low',
          actionable: true,
          suggestedAction: 'Consider allocating more resources to this category or investigating root causes.',
          metric: count,
        });
      }
    });

    return insights;
  }

  /**
   * Detect performance metrics issues
   */
  private detectPerformanceIssues(): InsightResult[] {
    const insights: InsightResult[] = [];
    const completed = this.data.filter(
      d => d.status === 'completed' && d.completed_at && d.created_at
    );

    if (completed.length > 0) {
      const resolutionTimes = completed.map(d => {
        const start = new Date(d.created_at).getTime();
        const end = new Date(d.completed_at!).getTime();
        return (end - start) / (1000 * 60 * 60); // hours
      });

      const avgTime = resolutionTimes.reduce((a, b) => a + b) / resolutionTimes.length;
      const medianTime =
        resolutionTimes.sort((a, b) => a - b)[Math.floor(resolutionTimes.length / 2)];

      if (avgTime > 72) {
        // 3 days
        insights.push({
          type: 'warning',
          title: 'Slow Resolution Time',
          message: `Average resolution time is ${Math.round(avgTime)} hours. Target should be ~48 hours.`,
          severity: 'medium',
          actionable: true,
          suggestedAction: 'Review workflow bottlenecks and process optimizations.',
          metric: Math.round(avgTime),
        });
      }
    }

    const completionRate = (completed.length / this.data.length) * 100;
    if (completionRate < 50) {
      insights.push({
        type: 'warning',
        title: 'Low Completion Rate',
        message: `Only ${Math.round(completionRate)}% of requests have been completed.`,
        severity: 'high',
        actionable: true,
        suggestedAction: 'Investigate why requests are not being completed and accelerate the process.',
        metric: Math.round(completionRate),
      });
    }

    return insights;
  }

  /**
   * Detect requests that have been stuck in their state
   */
  private detectStuckRequests(): InsightResult[] {
    const insights: InsightResult[] = [];
    const now = new Date();
    const stuckThreshold = 14 * 24 * 60 * 60 * 1000; // 14 days

    const inProgressOld = this.data.filter(d => {
      if (d.status !== 'in_progress') return false;
      const age = now.getTime() - new Date(d.created_at).getTime();
      return age > stuckThreshold;
    });

    if (inProgressOld.length > 0) {
      insights.push({
        type: 'alert',
        title: 'Stuck In-Progress Requests',
        message: `${inProgressOld.length} requests have been in progress for over 14 days.`,
        severity: 'high',
        actionable: true,
        suggestedAction: 'Review these requests and provide status updates or escalate as needed.',
        metric: inProgressOld.length,
      });
    }

    return insights;
  }

  /**
   * Helper: Group data by a field
   */
  private groupBy(data: DemandData[], key: string): Record<string, number> {
    return data.reduce((acc, item) => {
      const val = (item as any)[key];
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}
