'use client';

import { useEffect, useState } from 'react';

export interface DemandRequest {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  requester_id: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  completed_at?: string;
  notes?: string;
  users?: { id: string; name: string; email: string };
}

export interface DemandFilters {
  status?: string;
  priority?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export function useDemands(filters?: DemandFilters) {
  const [demands, setDemands] = useState<DemandRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (filters?.status) params.append('status', filters.status);
        if (filters?.priority) params.append('priority', filters.priority);
        if (filters?.category) params.append('category', filters.category);
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());

        const response = await fetch(`/api/demands?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch demands');
        }

        const result = await response.json();
        setDemands(result.data);
        setTotal(result.total);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchDemands();
  }, [filters]);

  return { demands, loading, error, total };
}

export function useDemand(id: string) {
  const [demand, setDemand] = useState<DemandRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemand = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/demands/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch demand');
        }

        const result = await response.json();
        setDemand(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDemand();
  }, [id]);

  return { demand, loading, error };
}

export function useCreateDemand() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDemand = async (data: Partial<DemandRequest>) => {
    try {
      setLoading(true);
      const response = await fetch('/api/demands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create demand');
      }

      const result = await response.json();
      setError(null);
      return result.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createDemand, loading, error };
}

export function useUpdateDemand(id: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDemand = async (data: Partial<DemandRequest>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/demands/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update demand');
      }

      const result = await response.json();
      setError(null);
      return result.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateDemand, loading, error };
}

export function useDeleteDemand(id: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDemand = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/demands/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete demand');
      }

      setError(null);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteDemand, loading, error };
}
