'use client';

import React, { useCallback, useState } from 'react';
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
} from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Palette, Save, Download, Undo, Redo } from 'lucide-react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 250, y: 250 },
    data: { label: 'Main Idea' },
    style: { backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px' },
  },
  {
    id: '2',
    type: 'default',
    position: { x: 100, y: 100 },
    data: { label: 'Subtopic 1' },
    style: { backgroundColor: '#10b981', color: 'white', borderRadius: '8px' },
  },
  {
    id: '3',
    type: 'default',
    position: { x: 400, y: 100 },
    data: { label: 'Subtopic 2' },
    style: { backgroundColor: '#f59e0b', color: 'white', borderRadius: '8px' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

const nodeColors = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Orange
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
];

interface MindMapEditorProps {
  title?: string;
  onSave?: (data: any) => void;
  nodes?: Node[];
  edges?: Edge[];
}


export function MindMapEditor({
  title = 'Untitled Mind Map',
  onSave,
  nodes: initialNodesProp,
  edges: initialEdgesProp,
}: MindMapEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodesProp ?? initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgesProp ?? initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [nodeText, setNodeText] = useState('');
  const [nodeColor, setNodeColor] = useState('#3b82f6');
  const [nextNodeId, setNextNodeId] = useState(4);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setNodeText('hello');
    setNodeColor(node.style?.backgroundColor || '#3b82f6');
    setIsEditDialogOpen(true);
  }, []);

  const addNewNode = useCallback(() => {
    const newNode: Node = {
      id: nextNodeId.toString(),
      type: 'default',
      position: { x: Math.random() * 600 + 100, y: Math.random() * 400 + 100 }, // tăng khoảng random
      data: { label: 'New Node' },
      style: { backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px' },
    };
    console.log('Add node', newNode);
    setNodes((nds) => [...nds, newNode]);
    setNextNodeId(id => id + 1);
  }, [nextNodeId, setNodes]);

  const updateNode = useCallback(() => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? {
            ...node,
            data: { ...node.data, label: nodeText },
            style: { ...node.style, backgroundColor: nodeColor },
          }
          : node
      )
    );
    setIsEditDialogOpen(false);
    setSelectedNode(null);
  }, [selectedNode, nodeText, nodeColor, setNodes]);

  const deleteNode = useCallback(() => {
    if (!selectedNode) return;

    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) => eds.filter((edge) =>
      edge.source !== selectedNode.id && edge.target !== selectedNode.id
    ));
    setIsEditDialogOpen(false);
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  const handleSave = useCallback(() => {
    const data = { nodes, edges };
    onSave?.(data);
    // In a real app, this would save to the backend
    console.log('Saving mind map:', data);
  }, [nodes, edges, onSave]);

  const handleExport = useCallback(() => {
    const data = { title, nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [title, nodes, edges]);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={addNewNode}>
              <Plus className="h-4 w-4 mr-2" />
              Add Node
            </Button>
            <Button variant="outline" size="sm">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Redo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Mind Map Canvas */}
      <div style={{ width: '100%', height: '600px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Edit Node Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
            <DialogDescription>
              Update the text and appearance of this node.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="node-text" className="text-right">
                Text
              </Label>
              <Input
                id="node-text"
                value={nodeText}
                onChange={(e) => setNodeText(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="node-color" className="text-right">
                Color
              </Label>
              <div className="col-span-3">
                <div className="flex space-x-2">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteNode}>
              Delete
            </Button>
            <Button onClick={updateNode}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}