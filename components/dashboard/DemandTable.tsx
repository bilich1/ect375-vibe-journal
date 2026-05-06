'use client';

import React, { useState } from 'react';
import { DemandRequest } from '@/lib/hooks/useDemands';

interface DemandTableProps {
  demands: DemandRequest[];
  loading?: boolean;
  onSelectDemand?: (demand: DemandRequest) => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  delayed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-300 text-gray-700',
};

const priorityColors: Record<string, string> = {
  low: 'text-gray-600',
  medium: 'text-blue-600',
  high: 'text-orange-600',
  critical: 'text-red-600 font-bold',
};

const priorityIcons: Record<string, string> = {
  low: '⬇️',
  medium: '➡️',
  high: '⬆️',
  critical: '🔴',
};

export function DemandTable({ demands, loading, onSelectDemand }: DemandTableProps) {
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedDemands = [...demands].sort((a, b) => {
    let aVal: any = (a as any)[sortBy];
    let bVal: any = (b as any)[sortBy];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading demands...</div>;
  }

  if (demands.length === 0) {
    return <div className="p-8 text-center text-gray-500">No demands found</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th
              className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleSort('title')}
            >
              Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleSort('status')}
            >
              Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleSort('priority')}
            >
              Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Category
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Due Date
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedDemands.map((demand) => (
            <tr
              key={demand.id}
              className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSelectDemand?.(demand)}
            >
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">{demand.title}</p>
                  <p className="text-sm text-gray-500">{demand.description}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-sm font-medium ${statusColors[demand.status]}`}>
                  {demand.status.replace('_', ' ').toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className={`flex items-center gap-2 ${priorityColors[demand.priority]}`}>
                  <span className="text-lg">{priorityIcons[demand.priority]}</span>
                  <span className="text-sm font-medium">{demand.priority.toUpperCase()}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {demand.category}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {demand.due_date
                  ? new Date(demand.due_date).toLocaleDateString()
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
