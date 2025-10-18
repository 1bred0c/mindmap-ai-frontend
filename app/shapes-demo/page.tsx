'use client';

/**
 * 🌌 COSMIC MINDMAP SHAPE DEMO
 * Interactive demonstration of all 10 node shapes
 * Use this page to test and preview shapes before deploying
 */

import React, { useState } from 'react';
import { ReactFlow, Background, Controls, BackgroundVariant } from '@xyflow/react';
import CustomNode, { NodeShape } from '@/components/custom-node';
import { ShapeSelector } from '@/components/shape-selector';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import '@xyflow/react/dist/style.css';
import '../node-shapes.css';

const DEMO_SHAPES: NodeShape[] = [
  'RECTANGLE', 'CIRCLE', 'ELLIPSE', 'DIAMOND',
  'HEXAGON', 'OCTAGON', 'PARALLELOGRAM', 'TRAPEZOID',
  'STAR', 'CLOUD'
];

const SHAPE_COLORS = [
  '#8b5cf6', // purple
  '#00ffff', // cyan
  '#00ffb3', // green
  '#22d3ee', // sky
  '#f59e0b', // amber
  '#ef4444', // red
  '#84cc16', // lime
  '#f97316', // orange
  '#fbbf24', // yellow
  '#06b6d4', // blue
];

export default function ShapesDemoPage() {
  const [selectedShape, setSelectedShape] = useState<NodeShape>('RECTANGLE');
  const [selectedColor, setSelectedColor] = useState('#8b5cf6');

  // Generate demo nodes for all shapes
  const demoNodes = DEMO_SHAPES.map((shape, index) => ({
    id: `demo-${index}`,
    type: 'customNode',
    data: {
      label: shape,
      shape: shape,
      color: SHAPE_COLORS[index]
    },
    position: {
      x: 100 + (index % 5) * 200,
      y: 100 + Math.floor(index / 5) * 200
    }
  }));

  // Preview node with selected shape
  const previewNode = [{
    id: 'preview',
    type: 'customNode',
    data: {
      label: 'Preview',
      shape: selectedShape,
      color: selectedColor
    },
    position: { x: 400, y: 500 },
    selected: true
  }];

  const nodeTypes = { customNode: CustomNode };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
            🌌 Cosmic Mindmap Shapes
          </h1>
          <p className="text-muted-foreground">
            Interactive demo of all 10 node shapes with dark neon theme
          </p>
        </div>

        {/* Shape Gallery */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Shape Gallery</h2>
          <div className="h-[400px] border rounded-lg bg-black/20">
            <ReactFlow
              nodes={demoNodes}
              edges={[]}
              nodeTypes={nodeTypes}
              fitView
              proOptions={{ hideAttribution: true }}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
            >
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
              <Controls position="top-right" />
            </ReactFlow>
          </div>
        </Card>

        {/* Interactive Preview */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Interactive Preview</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Select Shape</h3>
                <ShapeSelector
                  selectedShape={selectedShape}
                  onShapeChange={setSelectedShape}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Select Color</h3>
                <div className="grid grid-cols-5 gap-2">
                  {SHAPE_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        selectedColor === color
                          ? 'border-white scale-110'
                          : 'border-gray-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                <p><strong>Hover:</strong> Scale + Glow increase</p>
                <p><strong>Selected:</strong> Pulsing neon animation</p>
                <p><strong>Drag:</strong> Smooth position updates</p>
              </div>
            </div>

            {/* Preview Canvas */}
            <div className="h-[400px] border rounded-lg bg-black/20">
              <ReactFlow
                nodes={previewNode}
                edges={[]}
                nodeTypes={nodeTypes}
                fitView
                proOptions={{ hideAttribution: true }}
              >
                <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
              </ReactFlow>
            </div>
          </div>
        </Card>

        {/* Shape Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Shape Details</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMO_SHAPES.map((shape, index) => (
              <div
                key={shape}
                className="p-4 border rounded-lg space-y-2 hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{shape}</span>
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: SHAPE_COLORS[index] }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {getShapeDescription(shape)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Code Example */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
          <pre className="p-4 bg-black/40 rounded-lg overflow-x-auto text-sm">
            <code>{`// Update node shape
import { useUpdateNodeShape } from '@/hooks/use-update-node-shape';

const { updateNodeShape } = useUpdateNodeShape();

await updateNodeShape('nodeId', '${selectedShape}');

// Create new node with shape
const newNode = {
  mind_map_id: 1,
  content: 'My Node',
  shape: '${selectedShape}',
  color: '${selectedColor}',
  position_x: 300,
  position_y: 200
};`}</code>
          </pre>
        </Card>

      </div>
    </div>
  );
}

function getShapeDescription(shape: NodeShape): string {
  const descriptions: Record<NodeShape, string> = {
    RECTANGLE: 'Default shape, best for headings and main ideas',
    CIRCLE: 'Perfect for start/end points and status indicators',
    ELLIPSE: 'Ideal for processes and action items',
    DIAMOND: 'Decision points and conditional logic',
    HEXAGON: 'Modules, APIs, and services',
    OCTAGON: 'Warnings, alerts, and stop actions',
    PARALLELOGRAM: 'Data flow and input/output operations',
    TRAPEZOID: 'Storage, databases, and data containers',
    STAR: 'Highlights, favorites, and important items',
    CLOUD: 'Cloud services, thoughts, and external systems'
  };
  return descriptions[shape];
}
