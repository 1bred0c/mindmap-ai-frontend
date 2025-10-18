'use client';

import React from 'react';
import { NodeShape } from '@/components/custom-node';
import { Label } from '@/components/ui/label';

interface ShapeSelectorProps {
  selectedShape: NodeShape;
  onShapeChange: (shape: NodeShape) => void;
}

const shapes: Array<{ value: NodeShape; label: string; icon: string }> = [
  { value: 'RECTANGLE', label: 'Rectangle', icon: '▭' },
  { value: 'CIRCLE', label: 'Circle', icon: '●' },
  { value: 'ELLIPSE', label: 'Ellipse', icon: '⬭' },
  { value: 'DIAMOND', label: 'Diamond', icon: '◆' },
  { value: 'HEXAGON', label: 'Hexagon', icon: '⬡' },
  { value: 'OCTAGON', label: 'Octagon', icon: '⯄' },
  { value: 'PARALLELOGRAM', label: 'Parallelogram', icon: '▱' },
  { value: 'TRAPEZOID', label: 'Trapezoid', icon: '⏢' },
  { value: 'STAR', label: 'Star', icon: '★' },
  { value: 'CLOUD', label: 'Cloud', icon: '☁' },
];

export function ShapeSelector({ selectedShape, onShapeChange }: ShapeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Node Shape</Label>
      <div className="grid grid-cols-5 gap-2">
        {shapes.map((shape) => (
          <button
            key={shape.value}
            type="button"
            onClick={() => onShapeChange(shape.value)}
            className={`
              relative flex flex-col items-center justify-center p-3 rounded-lg border-2 
              transition-all duration-200 hover:scale-105
              ${
                selectedShape === shape.value
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/30'
                  : 'border-border bg-background hover:border-primary/50'
              }
            `}
            title={shape.label}
          >
            <span className="text-2xl mb-1">{shape.icon}</span>
            <span className="text-[10px] font-medium text-center leading-tight">
              {shape.label}
            </span>
            {selectedShape === shape.value && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
