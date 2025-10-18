// =====================================================
// COSMIC MINDMAP - EXAMPLE USAGE
// Demonstrates all 10 node shapes with different scenarios
// =====================================================

import { useUpdateNodeShape } from '@/hooks/use-update-node-shape';
import { NodeShape } from '@/components/custom-node';
import { supabase } from '@/lib/supabaseClient';

// =====================================================
// EXAMPLE 1: Initial Mindmap Setup
// =====================================================
export const exampleMindmapData = {
  mindMapId: 1,
  title: "Project Architecture",
  nodes: [
    {
      node_id: 1,
      content: "Main App",
      shape: "RECTANGLE",
      color: "#8b5cf6",
      position_x: 400,
      position_y: 100
    },
    {
      node_id: 2,
      content: "User Auth",
      shape: "CIRCLE",
      color: "#00ffff",
      position_x: 200,
      position_y: 250
    },
    {
      node_id: 3,
      content: "Database",
      shape: "TRAPEZOID",
      color: "#f97316",
      position_x: 600,
      position_y: 250
    },
    {
      node_id: 4,
      content: "Is Authenticated?",
      shape: "DIAMOND",
      color: "#22d3ee",
      position_x: 200,
      position_y: 400
    },
    {
      node_id: 5,
      content: "API Gateway",
      shape: "HEXAGON",
      color: "#f59e0b",
      position_x: 400,
      position_y: 400
    },
    {
      node_id: 6,
      content: "Cache Layer",
      shape: "ELLIPSE",
      color: "#00ffb3",
      position_x: 600,
      position_y: 400
    },
    {
      node_id: 7,
      content: "⚠️ Rate Limit",
      shape: "OCTAGON",
      color: "#ef4444",
      position_x: 100,
      position_y: 550
    },
    {
      node_id: 8,
      content: "Data Flow →",
      shape: "PARALLELOGRAM",
      color: "#84cc16",
      position_x: 300,
      position_y: 550
    },
    {
      node_id: 9,
      content: "⭐ Premium Feature",
      shape: "STAR",
      color: "#fbbf24",
      position_x: 500,
      position_y: 550
    },
    {
      node_id: 10,
      content: "☁️ AWS Services",
      shape: "CLOUD",
      color: "#06b6d4",
      position_x: 700,
      position_y: 550
    }
  ],
  edges: [
    { from_node_id: 1, to_node_id: 2, label: "auth" },
    { from_node_id: 1, to_node_id: 3, label: "data" },
    { from_node_id: 2, to_node_id: 4, label: "check" },
    { from_node_id: 4, to_node_id: 5, label: "yes" },
    { from_node_id: 5, to_node_id: 6, label: "cache" },
    { from_node_id: 5, to_node_id: 7, label: "limit" },
    { from_node_id: 6, to_node_id: 8, label: "stream" },
    { from_node_id: 1, to_node_id: 9, label: "unlock" },
    { from_node_id: 3, to_node_id: 10, label: "deploy" }
  ]
};

// =====================================================
// EXAMPLE 2: Supabase JSON Response Simulation
// =====================================================
export const supabaseNodeResponse = {
  data: [
    {
      node_id: 101,
      mind_map_id: 5,
      content: "Frontend React App",
      position_x: 300,
      position_y: 100,
      color: "#8b5cf6",
      shape: "RECTANGLE",
      created_at: "2025-01-15T10:00:00Z",
      updated_at: "2025-01-15T10:00:00Z"
    },
    {
      node_id: 102,
      mind_map_id: 5,
      content: "Backend API",
      position_x: 300,
      position_y: 250,
      color: "#00ffff",
      shape: "HEXAGON",
      created_at: "2025-01-15T10:05:00Z",
      updated_at: "2025-01-15T10:05:00Z"
    }
  ],
  error: null
};

// =====================================================
// EXAMPLE 3: Update Node Shape Programmatically
// =====================================================
export function ShapeUpdateExample() {
  const { updateNodeShape, batchUpdateNodeShapes } = useUpdateNodeShape();

  // Single update
  const handleChangeToStar = async (nodeId: string) => {
    await updateNodeShape(nodeId, 'STAR');
  };

  // Batch update
  const handleConvertAllToCircles = async (nodeIds: string[]) => {
    const updates = nodeIds.map(id => ({
      nodeId: id,
      shape: 'CIRCLE' as NodeShape
    }));
    await batchUpdateNodeShapes(updates);
  };

  // Conditional shape based on content
  const autoAssignShape = async (nodeId: string, content: string) => {
    let shape: NodeShape = 'RECTANGLE';
    
    if (content.includes('?')) shape = 'DIAMOND';
    else if (content.includes('⭐')) shape = 'STAR';
    else if (content.includes('☁️')) shape = 'CLOUD';
    else if (content.includes('⚠️')) shape = 'OCTAGON';
    else if (content.toLowerCase().includes('database')) shape = 'TRAPEZOID';
    else if (content.toLowerCase().includes('api')) shape = 'HEXAGON';
    
    await updateNodeShape(nodeId, shape);
  };

  return null;
}

// =====================================================
// EXAMPLE 4: React Flow Node State Structure
// =====================================================
export const reactFlowNodesExample = [
  {
    id: "1",
    type: "customNode",
    data: {
      label: "Start Here",
      shape: "CIRCLE",
      color: "#00ffff"
    },
    position: { x: 100, y: 100 }
  },
  {
    id: "2",
    type: "customNode",
    data: {
      label: "Decision Point",
      shape: "DIAMOND",
      color: "#22d3ee"
    },
    position: { x: 300, y: 100 }
  },
  {
    id: "3",
    type: "customNode",
    data: {
      label: "Cloud Service",
      shape: "CLOUD",
      color: "#06b6d4"
    },
    position: { x: 500, y: 100 }
  }
];

// =====================================================
// EXAMPLE 5: Realtime Subscription Handler
// =====================================================
export const setupRealtimeShapeSync = (mindMapId: number) => {
  const channel = supabase
    .channel(`shapes-${mindMapId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'nodes',
        filter: `mind_map_id=eq.${mindMapId}`
      },
      (payload) => {
        const updatedNode = payload.new;
        
        console.log('🔄 Shape Updated:', {
          nodeId: updatedNode.node_id,
          oldShape: payload.old.shape,
          newShape: updatedNode.shape,
          color: updatedNode.color
        });

        // Update local state
        setNodes((prev) =>
          prev.map((node) =>
            node.id === String(updatedNode.node_id)
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    shape: updatedNode.shape,
                    color: updatedNode.color,
                    label: updatedNode.content
                  }
                }
              : node
          )
        );
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// =====================================================
// EXAMPLE 6: Shape Presets for Common Use Cases
// =====================================================
export const shapePresets = {
  flowchart: {
    start: 'CIRCLE',
    process: 'RECTANGLE',
    decision: 'DIAMOND',
    end: 'CIRCLE'
  },
  architecture: {
    frontend: 'HEXAGON',
    backend: 'HEXAGON',
    database: 'TRAPEZOID',
    cache: 'ELLIPSE',
    cloudService: 'CLOUD',
    warning: 'OCTAGON'
  },
  mindmap: {
    mainIdea: 'CIRCLE',
    subIdea: 'RECTANGLE',
    important: 'STAR',
    note: 'CLOUD',
    task: 'PARALLELOGRAM'
  },
  network: {
    server: 'HEXAGON',
    client: 'CIRCLE',
    router: 'DIAMOND',
    storage: 'TRAPEZOID',
    firewall: 'OCTAGON'
  }
};

// =====================================================
// EXAMPLE 7: Bulk Import from JSON
// =====================================================
export const importNodesFromJSON = async (
  mindMapId: number,
  jsonData: any[]
) => {
  const nodesToInsert = jsonData.map(item => ({
    mind_map_id: mindMapId,
    content: item.label,
    shape: item.shape || 'RECTANGLE',
    color: item.color || '#3b82f6',
    position_x: item.x || Math.random() * 500,
    position_y: item.y || Math.random() * 300
  }));

  const { data, error } = await supabase
    .from('nodes')
    .insert(nodesToInsert)
    .select();

  if (error) {
    console.error('Import failed:', error);
    return;
  }

  console.log(`✅ Imported ${data.length} nodes`);
  return data;
};

// =====================================================
// EXAMPLE 8: Export Mindmap with Shapes
// =====================================================
export const exportMindmapJSON = async (mindMapId: number) => {
  const { data: nodes } = await supabase
    .from('nodes')
    .select('*')
    .eq('mind_map_id', mindMapId);

  const { data: edges } = await supabase
    .from('edges')
    .select('*')
    .eq('mind_map_id', mindMapId);

  const exportData = {
    version: '1.0',
    mindMapId,
    exportDate: new Date().toISOString(),
    nodes: nodes?.map(n => ({
      id: n.node_id,
      label: n.content,
      shape: n.shape,
      color: n.color,
      x: n.position_x,
      y: n.position_y
    })),
    edges: edges?.map(e => ({
      from: e.from_node_id,
      to: e.to_node_id,
      label: e.label
    }))
  };

  // Download as JSON file
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mindmap-${mindMapId}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// =====================================================
// EXAMPLE 9: Shape Analytics
// =====================================================
export const getShapeStatistics = async (mindMapId: number) => {
  const { data: nodes } = await supabase
    .from('nodes')
    .select('shape')
    .eq('mind_map_id', mindMapId);

  const shapeCount = nodes?.reduce((acc, node) => {
    acc[node.shape] = (acc[node.shape] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('📊 Shape Distribution:', shapeCount);
  return shapeCount;
};

// =====================================================
// EXAMPLE 10: TypeScript Types
// =====================================================
export interface CosmicNode {
  node_id: number;
  mind_map_id: number;
  content: string;
  position_x: number;
  position_y: number;
  color: string;
  shape: NodeShape;
  created_at?: string;
  updated_at?: string;
}

export interface ReactFlowNodeData {
  label: string;
  shape: NodeShape;
  color: string;
}

export interface ShapeUpdatePayload {
  nodeId: string;
  shape: NodeShape;
  color?: string;
}

export default {
  exampleMindmapData,
  supabaseNodeResponse,
  reactFlowNodesExample,
  shapePresets,
  importNodesFromJSON,
  exportMindmapJSON,
  getShapeStatistics
};
