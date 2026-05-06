'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export type ChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeOptions {
  table: string;
  event?: ChangeEvent;
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
}

export function useRealtime({
  table,
  event = '*',
  filter,
  onInsert,
  onUpdate,
  onDelete,
}: UseRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    let subscription: any;

    const setupSubscription = async () => {
      try {
        // Subscribe to real-time changes
        let query = supabase
          .channel(`public:${table}`)
          .on(
            'postgres_changes',
            {
              event,
              schema: 'public',
              table,
              ...(filter && { filter }),
            },
            (payload: RealtimePostgresChangesPayload<any>) => {
              console.log('Real-time update:', payload);

              if (payload.eventType === 'INSERT' && onInsert) {
                onInsert(payload.new);
              } else if (payload.eventType === 'UPDATE' && onUpdate) {
                onUpdate(payload.new);
              } else if (payload.eventType === 'DELETE' && onDelete) {
                onDelete(payload.old);
              }
            }
          )
          .on('system', {}, (payload) => {
            if (payload.type === 'CONNECTED') {
              setIsConnected(true);
              setError(null);
            }
          });

        subscription = query.subscribe();
        setIsConnected(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        console.error('Real-time subscription error:', err);
      }
    };

    setupSubscription();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [table, event, filter]);

  return { isConnected, error };
}
