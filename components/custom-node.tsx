'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export type NodeShape =
  | 'RECTANGLE'
  | 'CIRCLE'
  | 'ELLIPSE'
  | 'DIAMOND'
  | 'HEXAGON'
  | 'OCTAGON'
  | 'PARALLELOGRAM'
  | 'TRAPEZOID'
  | 'STAR'
  | 'CLOUD';

interface CustomNodeData extends Record<string, unknown> {
  label: string;
  shape?: NodeShape;
  color?: string;
}

const CustomNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as CustomNodeData;
  const shape = nodeData.shape || 'RECTANGLE';
  const color = nodeData.color || '#3b82f6';
  const label = nodeData.label || 'Node';

  const getShapeClasses = () => {
    const baseClasses = 'relative flex items-center justify-center text-white font-medium text-sm transition-all duration-300';
    const selectedClass = selected ? 'node-selected' : '';
    
    switch (shape) {
      case 'CIRCLE':
        return `${baseClasses} node-circle ${selectedClass}`;
      case 'ELLIPSE':
        return `${baseClasses} node-ellipse ${selectedClass}`;
      case 'DIAMOND':
        return `${baseClasses} node-diamond ${selectedClass}`;
      case 'HEXAGON':
        return `${baseClasses} node-hexagon ${selectedClass}`;
      case 'OCTAGON':
        return `${baseClasses} node-octagon ${selectedClass}`;
      case 'PARALLELOGRAM':
        return `${baseClasses} node-parallelogram ${selectedClass}`;
      case 'TRAPEZOID':
        return `${baseClasses} node-trapezoid ${selectedClass}`;
      case 'STAR':
        return `${baseClasses} node-star ${selectedClass}`;
      case 'CLOUD':
        return `${baseClasses} node-cloud ${selectedClass}`;
      case 'RECTANGLE':
      default:
        return `${baseClasses} node-rectangle ${selectedClass}`;
    }
  };

  const getShapeStyle = () => {
    const neonColor = color;
    return {
      backgroundColor: `${neonColor}dd`,
      '--node-color': neonColor,
    } as React.CSSProperties;
  };

  const renderShapeContent = () => {
    if (shape === 'STAR') {
      return (
        <div className="relative w-[120px] h-[120px]">
          <svg
            viewBox="0 0 120 120"
            className={`w-full h-full ${selected ? 'node-selected' : ''}`}
            style={{ 
              filter: selected 
                ? `drop-shadow(0 0 25px ${color}) drop-shadow(0 0 15px ${color})`
                : `drop-shadow(0 0 12px ${color})`
            }}
          >
            <defs>
              <linearGradient id={`starGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.7 }} />
              </linearGradient>
            </defs>
            <path
              d="M60,15 L72,45 L105,50 L82,72 L88,105 L60,88 L32,105 L38,72 L15,50 L48,45 Z"
              fill={`url(#starGrad-${color})`}
              stroke={color}
              strokeWidth="2"
              className="star-path transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center z-10 px-3 text-center pointer-events-none">
            <span className="drop-shadow-lg text-white font-medium text-sm">{label}</span>
          </div>
          <Handle type="target" position={Position.Top} className="node-handle" />
          <Handle type="source" position={Position.Bottom} className="node-handle" />
        </div>
      );
    }

    if (shape === 'CLOUD') {
      return (
        <div className="relative w-[140px] h-[90px]">
          <svg
            viewBox="0 0 140 90"
            className={`w-full h-full ${selected ? 'node-selected' : ''}`}
            style={{ 
              filter: selected 
                ? `drop-shadow(0 0 25px ${color}) drop-shadow(0 0 15px ${color})`
                : `drop-shadow(0 0 12px ${color})`
            }}
          >
            <defs>
              <linearGradient id={`cloudGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.7 }} />
              </linearGradient>
            </defs>
            <path
              d="M 30,50 Q 20,30 40,25 Q 45,10 65,15 Q 85,10 95,25 Q 120,25 115,50 Q 125,65 105,70 L 35,70 Q 15,65 30,50 Z"
              fill={`url(#cloudGrad-${color})`}
              stroke={color}
              strokeWidth="2"
              className="cloud-path transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center z-10 px-4 text-center pointer-events-none">
            <span className="drop-shadow-lg text-white font-medium text-sm">{label}</span>
          </div>
          <Handle type="target" position={Position.Top} className="node-handle" />
          <Handle type="source" position={Position.Bottom} className="node-handle" />
        </div>
      );
    }

    // Default shapes with CSS
    return (
      <div className={getShapeClasses()} style={getShapeStyle()}>
        <div className="px-4 py-2 z-10 text-center max-w-[140px] break-words">
          {label}
        </div>
        <Handle type="target" position={Position.Top} className="node-handle" />
        <Handle type="source" position={Position.Bottom} className="node-handle" />
      </div>
    );
  };

  return renderShapeContent();
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;
