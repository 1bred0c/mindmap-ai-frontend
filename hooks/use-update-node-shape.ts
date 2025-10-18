'use client';

import { useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { NodeShape } from '@/components/custom-node';

/**
 * Custom hook to update node shape in Supabase and sync with local state
 * Supports realtime sync across all connected clients
 */
export function useUpdateNodeShape() {
  /**
   * Update a node's shape in Supabase
   * @param nodeId - The ID of the node to update
   * @param newShape - The new shape to apply
   * @param onSuccess - Optional callback on successful update
   * @param onError - Optional callback on error
   */
  const updateNodeShape = useCallback(
    async (
      nodeId: string,
      newShape: NodeShape,
      onSuccess?: () => void,
      onError?: (error: Error) => void
    ) => {
      try {
        const { error } = await supabase
          .from('nodes')
          .update({ shape: newShape })
          .eq('node_id', nodeId);

        if (error) {
          throw error;
        }

        toast.success(`✨ Shape changed to ${newShape}`);
        onSuccess?.();
      } catch (err) {
        console.error('Error updating node shape:', err);
        toast.error('❌ Failed to update shape');
        onError?.(err as Error);
      }
    },
    []
  );

  /**
   * Batch update multiple nodes' shapes
   * @param updates - Array of {nodeId, shape} objects
   */
  const batchUpdateNodeShapes = useCallback(
    async (updates: Array<{ nodeId: string; shape: NodeShape }>) => {
      try {
        const promises = updates.map(({ nodeId, shape }) =>
          supabase
            .from('nodes')
            .update({ shape })
            .eq('node_id', nodeId)
        );

        const results = await Promise.all(promises);
        const errors = results.filter((r) => r.error);

        if (errors.length > 0) {
          throw new Error(`Failed to update ${errors.length} nodes`);
        }

        toast.success(`✨ Updated ${updates.length} node shapes`);
      } catch (err) {
        console.error('Error batch updating node shapes:', err);
        toast.error('❌ Failed to batch update shapes');
      }
    },
    []
  );

  return {
    updateNodeShape,
    batchUpdateNodeShapes,
  };
}
