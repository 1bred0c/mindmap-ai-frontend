'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Handle,
  Position,
} from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Save, Download, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import CustomNode, { NodeShape } from '@/components/custom-node';
import { ShapeSelector } from '@/components/shape-selector';
import { useUpdateNodeShape } from '@/hooks/use-update-node-shape';
import { useLanguage } from '@/contexts/language-context';
import '@xyflow/react/dist/style.css';
import '../app/node-shapes.css';

const nodeColors = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
];

interface MindMapEditorProps {
  title?: string;
  mindMapId: number;
  viewOnly?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function MindMapEditor({
  title = 'Untitled Mind Map',
  mindMapId,
  viewOnly = false,
  showBackButton = false,
  onBack,
}: MindMapEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [nodeText, setNodeText] = useState('');
  const [nodeColor, setNodeColor] = useState('#3b82f6');
  const [nodeShape, setNodeShape] = useState<NodeShape>('RECTANGLE');
  const [loading, setLoading] = useState(true);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [labelPosition, setLabelPosition] = useState<{ x: number; y: number } | null>(null);

  const { updateNodeShape } = useUpdateNodeShape();
  const { t } = useLanguage();

  // 🔹 Register custom node types
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  const onEdgeDoubleClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();

      // ✅ Lấy vị trí click
      const clickX = event.clientX;
      const clickY = event.clientY;

      // ✅ Hiển thị input cao hơn một chút (ví dụ 20px)
      setLabelPosition({ x: clickX, y: clickY - 20 });
      setEditingEdgeId(edge.id);
      setEditingLabel(String(edge.label || ''));
    },
    []
  );




  const saveEdgeLabel = useCallback(async () => {
    if (!editingEdgeId) return;

    const { error } = await supabase
      .from('edges')
      .update({ label: editingLabel })
      .eq('edge_id', editingEdgeId);

    if (error) {
      toast.error(t('mindmap.editor.toast.errorUpdatingEdgeLabel'));
      return;
    }

    setEdges((eds) =>
      eds.map((e) =>
        e.id === editingEdgeId ? { ...e, label: editingLabel } : e
      )
    );

    setEditingEdgeId(null);
    toast.success(t('mindmap.editor.toast.edgeLabelUpdated'));
  }, [editingEdgeId, editingLabel, setEdges, t]);


  const onEdgeClick = useCallback((_event: any, edge: Edge) => {
    setSelectedEdge(edge);
    toast.message(`${t('mindmap.editor.toast.selectedEdge')} ${edge.id}`);
  }, [t]);
  const handleDeleteEdge = useCallback(async () => {
    if (!selectedEdge) {
      toast.error(t('mindmap.editor.toast.noEdgeSelected'));
      return;
    }

    // ⚡ Xóa local để phản hồi nhanh
    setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));

    // 🔄 Xóa trong DB → realtime sync cho người khác
    const { error } = await supabase.from('edges').delete().eq('edge_id', selectedEdge.id);
    if (error) {
      toast.error(t('mindmap.editor.toast.errorDeletingEdge'));
      return;
    }

    toast.success(t('mindmap.editor.toast.edgeDeleted'));
    setSelectedEdge(null);
  }, [selectedEdge, setEdges, t]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete') handleDeleteEdge();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDeleteEdge]);


  // 🔹 Load nodes & edges from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: nodeData, error: nodeErr } = await supabase
          .from('nodes')
          .select('*')
          .eq('mind_map_id', mindMapId);

        const { data: edgeData, error: edgeErr } = await supabase
          .from('edges')
          .select('*')
          .eq('mind_map_id', mindMapId);

        if (nodeErr || edgeErr) throw nodeErr || edgeErr;

        setNodes(
          nodeData.map((n) => ({
            id: String(n.node_id),
            type: 'customNode',
            data: { 
              label: n.content,
              shape: (n.shape as NodeShape) || 'RECTANGLE',
              color: n.color || '#3b82f6'
            },
            position: { x: n.position_x, y: n.position_y },
          }))
        );

        setEdges(
          edgeData.map((e) => ({
            id: String(e.edge_id),
            source: String(e.from_node_id),
            target: String(e.to_node_id),
            label: e.label || '',
          }))
        );
      } catch (error) {
        console.error(error);
        toast.error(t('mindmap.editor.toast.errorLoadingMindmap'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const nodeChannel = supabase
      .channel('nodes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'nodes', filter: `mind_map_id=eq.${mindMapId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const n = payload.new;
            setNodes((prev) => [
              ...prev,
              {
                id: String(n.node_id),
                type: 'customNode',
                data: { 
                  label: n.content,
                  shape: (n.shape as NodeShape) || 'RECTANGLE',
                  color: n.color || '#3b82f6'
                },
                position: { x: n.position_x, y: n.position_y },
              },
            ]);
          }

          if (payload.eventType === 'UPDATE') {
            const n = payload.new;
            setNodes((prev) =>
              prev.map((node) =>
                node.id === String(n.node_id)
                  ? { 
                      ...node, 
                      data: { 
                        label: n.content,
                        shape: (n.shape as NodeShape) || 'RECTANGLE',
                        color: n.color || '#3b82f6'
                      }, 
                      position: { x: n.position_x, y: n.position_y } 
                    }
                  : node
              )
            );
          }

          if (payload.eventType === 'DELETE') {
            const n = payload.old;
            setNodes((prev) => prev.filter((node) => node.id !== String(n.node_id)));
          }
        }
      )
      .subscribe();

    const edgeChannel = supabase
      .channel('edges-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'edges', filter: `mind_map_id=eq.${mindMapId}` },
        (payload) => {
          console.log('🔄 Edge Realtime Event:', payload);

          if (payload.eventType === 'INSERT') {
            const e = payload.new;
            setEdges((prev) => [
              ...prev,
              {
                id: String(e.edge_id),
                source: String(e.from_node_id),
                target: String(e.to_node_id),
                label: e.label || '',
              },
            ]);
          }

          if (payload.eventType === 'UPDATE') {
            const e = payload.new;
            setEdges((prev) =>
              prev.map((edge) =>
                edge.id === String(e.edge_id)
                  ? { ...edge, label: e.label || '' }
                  : edge
              )
            );
          }

          if (payload.eventType === 'DELETE') {
            const e = payload.old;
            setEdges((prev) => prev.filter((edge) => edge.id !== String(e.edge_id)));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(nodeChannel);
      supabase.removeChannel(edgeChannel);
    };


  }, [mindMapId, setNodes, setEdges, t]);

  // 🔹 Add new node
  const addNewNode = useCallback(async () => {
    const newNode = {
      mind_map_id: mindMapId,
      content: t('mindmap.editor.newNode'),
      position_x: Math.random() * 500 + 100,
      position_y: Math.random() * 300 + 100,
      color: '#3b82f6',
      shape: 'RECTANGLE',
    };

    const { data, error } = await supabase.from('nodes').insert(newNode).select().single();
    if (error) {
      console.error(error);
      toast.error(t('mindmap.editor.toast.errorCreatingNode'));
      return;
    }

    setNodes((nds) => [
      ...nds,
      {
        id: String(data.node_id),
        type: 'customNode',
        data: { 
          label: data.content,
          shape: (data.shape as NodeShape) || 'RECTANGLE',
          color: data.color || '#3b82f6'
        },
        position: { x: data.position_x, y: data.position_y },
      },
    ]);

    toast.success(t('mindmap.editor.toast.nodeAdded'));
  }, [mindMapId, setNodes, t]);

  // 🔹 Update node (label, color, shape)
  const updateNode = useCallback(async () => {
    if (!selectedNode) return;

    const updatedData = {
      content: nodeText,
      color: nodeColor,
      shape: nodeShape,
      position_x: selectedNode.position.x,
      position_y: selectedNode.position.y,
    };

    // Cập nhật local trước
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? {
            ...n,
            data: { 
              label: nodeText,
              shape: nodeShape,
              color: nodeColor
            },
          }
          : n
      )
    );

    // Gửi update
    const { error } = await supabase
      .from('nodes')
      .update(updatedData)
      .eq('node_id', selectedNode.id);

    if (error) {
      toast.error(t('mindmap.editor.toast.errorUpdatingNode'));
      console.error(error);
      return;
    }

    toast.success(t('mindmap.editor.toast.nodeUpdated'));
    setIsEditDialogOpen(false);
  }, [selectedNode, nodeText, nodeColor, nodeShape, setNodes, t]);




  // 🔹 Delete node
  const deleteNode = useCallback(async () => {
    if (!selectedNode) return;

    // ⚡ Xóa tạm local ngay lập tức
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
      )
    );

    // 🔄 Gửi request xóa đến Supabase
    const { error } = await supabase
      .from('nodes')
      .delete()
      .eq('node_id', selectedNode.id);

    if (error) {
      toast.error(t('mindmap.editor.toast.errorDeletingNode'));
      return;
    }

    toast.success(t('mindmap.editor.toast.nodeDeleted'));
    setIsEditDialogOpen(false);
  }, [selectedNode, setNodes, setEdges, t]);



  // 🔹 Connect nodes = create edge
  const onConnect = useCallback(
    async (params: Connection | Edge) => {
      const newEdge = {
        mind_map_id: mindMapId,
        from_node_id: parseInt(params.source!),
        to_node_id: parseInt(params.target!),
        label: '',
      };
      const { data, error } = await supabase.from('edges').insert(newEdge).select().single();
      if (error) {
        console.error(error);
        toast.error(t('mindmap.editor.toast.errorCreatingEdge'));
        return;
      }

      setEdges((eds) => [
        ...eds,
        {
          id: String(data.edge_id),
          source: String(data.from_node_id),
          target: String(data.to_node_id),
          label: data.label || '',
        },
      ]);
      toast.success(t('mindmap.editor.toast.edgeCreated'));
    },
    [mindMapId, setEdges, t]
  );

  // 🔹 Delete edge (right-click)
  const onEdgeContextMenu = useCallback(
    async (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      const { error } = await supabase.from('edges').delete().eq('edge_id', edge.id);
      if (error) {
        toast.error(t('mindmap.editor.toast.errorDeletingEdge'));
        return;
      }
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      toast.success(t('mindmap.editor.toast.edgeDeleted'));
    },
    [setEdges, t]
  );

  // 🔹 Save node positions
  const handleSave = useCallback(async () => {
    const token = localStorage.getItem('token');

    try {
      // Cập nhật tất cả nodes trong Supabase
      const updates = nodes.map((n) =>
        supabase
          .from('nodes')
          .update({
            position_x: n.position.x,
            position_y: n.position.y,
          })
          .eq('node_id', Number(n.id))
      );

      await Promise.all(updates);
      toast.success(t('mindmap.editor.toast.mindmapSaved'));
    } catch (err) {
      console.error(err);
      toast.error(t('mindmap.editor.toast.errorSavingPositions'));
    }
  }, [nodes, t]);


  // 🔹 Click to edit node
  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
    const nodeData = node.data as { label?: string; color?: string; shape?: NodeShape };
    setNodeText(String(nodeData.label ?? ''));
    setNodeColor(String(nodeData.color ?? '#3b82f6'));
    setNodeShape(nodeData.shape ?? 'RECTANGLE');

    setIsEditDialogOpen(true);
  }, []);

  if (loading) return <div className="p-6 text-center">{t('mindmap.editor.loading')}</div>;

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b bg-background p-4 flex items-center justify-center relative">
        {/* Back Button - Left Side */}
        {showBackButton && (
          <div className="absolute left-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('mindmap.editor.backToMindmaps')}
            </Button>
          </div>
        )}
        
        <h1 className="text-xl font-semibold text-center">{title}</h1>
        
        {/* Action Buttons - Right Side */}
        <div className="absolute right-4 flex items-center gap-2">
          {!viewOnly && (
            <>
              <Button variant="outline" size="sm" onClick={addNewNode}>
                <Plus className="h-4 w-4 mr-2" /> {t('mindmap.editor.addNode')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> {t('mindmap.editor.save')}
              </Button>
            </>
          )}
        </div>
      </div>


      {/* Canvas */}
      <div style={{ width: '100%', height: 'calc(100vh - 64px)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onConnect={!viewOnly ? onConnect : undefined}
          onEdgeClick={!viewOnly ? onEdgeClick : undefined}
          onNodesChange={!viewOnly ? onNodesChange : undefined}
          onEdgesChange={!viewOnly ? onEdgesChange : undefined}
          onNodeClick={!viewOnly ? onNodeClick : undefined}
          onNodeDragStop={!viewOnly ? async (_, node) => {
            // Cập nhật vị trí trong local state
            setNodes((prev) =>
              prev.map((n) => (n.id === node.id ? { ...n, position: node.position } : n))
            );

            // Gửi vị trí mới lên Supabase
            await supabase
              .from('nodes')
              .update({
                position_x: node.position.x,
                position_y: node.position.y,
              })
              .eq('node_id', node.id);
          } : undefined}
          fitView
          proOptions={{ hideAttribution: true }}
          onEdgeDoubleClick={!viewOnly ? onEdgeDoubleClick : undefined}
        >
          {editingEdgeId && labelPosition && (
            <input
              className="absolute z-50 border border-gray-300 rounded px-2 py-1 text-sm bg-white text-black shadow"
              style={{
                top: labelPosition.y,
                left: labelPosition.x,
                transform: 'translate(-50%, -50%)',
              }}
              value={editingLabel}
              onChange={(e) => setEditingLabel(e.target.value)}
              onBlur={saveEdgeLabel}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdgeLabel();
                if (e.key === 'Escape') setEditingEdgeId(null);
              }}
              autoFocus
            />
          )}


          <MiniMap
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              width: 160,
              height: 120,
              borderRadius: 8,
              border: '1px solid #ccc',
              background: '#f8f9fa',
            }}
          />
          <Controls position="bottom-left" />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Edit Dialog */}
      {!viewOnly && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('mindmap.editor.editNode')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>{t('mindmap.editor.label')}</Label>
                <Input
                  value={nodeText}
                  onChange={(e) => setNodeText(e.target.value)}
                />
              </div>
              
              <ShapeSelector 
                selectedShape={nodeShape}
                onShapeChange={setNodeShape}
              />
              
              <div>
                <Label>{t('mindmap.editor.color')}</Label>
                <div className="flex gap-2 mt-1">
                  {nodeColors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${nodeColor === color ? 'border-gray-400' : 'border-gray-200'
                        }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNodeColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="destructive" onClick={deleteNode}>
                <Trash2 className="h-4 w-4 mr-1" /> {t('mindmap.editor.delete')}
              </Button>
              <Button onClick={updateNode}>{t('mindmap.editor.update')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div >
  );
}
