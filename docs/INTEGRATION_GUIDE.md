# Integration Guide: AI Generated Mindmap → Editor

## Cách tích hợp dữ liệu AI vào Mindmap Editor

### 1. Đọc dữ liệu từ sessionStorage

Trong file `app/mindmaps/new/page.tsx`, thêm logic để đọc dữ liệu từ AI:

```tsx
'use client';

import { MindMapEditor } from '@/components/mindmap-editor';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface GeneratedNode {
  content: string;
  parentNodeId: number | null;
  positionX: number;
  positionY: number;
  color: string;
  shape: string;
}

interface GeneratedEdge {
  fromNodeId: number;
  toNodeId: number;
  label: string;
}

interface GenerateMindmapResponse {
  title: string;
  nodes: GeneratedNode[];
  edges: GeneratedEdge[];
}

export default function NewMindMapPage() {
    const [initialNodes, setInitialNodes] = useState([]);
    const [initialEdges, setInitialEdges] = useState([]);
    const [title, setTitle] = useState('');
    const searchParams = useSearchParams();
    const fromAI = searchParams.get('from') === 'ai';

    useEffect(() => {
        if (fromAI) {
            // Đọc dữ liệu từ sessionStorage
            const aiDataStr = sessionStorage.getItem('aiGeneratedMindmap');
            if (aiDataStr) {
                try {
                    const aiData: GenerateMindmapResponse = JSON.parse(aiDataStr);
                    
                    // Convert AI nodes to React Flow nodes
                    const flowNodes = aiData.nodes.map((node, index) => ({
                        id: `node-${index}`,
                        type: 'default',
                        position: { x: node.positionX, y: node.positionY },
                        data: { 
                            label: node.content,
                            shape: node.shape,
                        },
                        style: {
                            backgroundColor: node.color,
                            borderRadius: getShapeBorderRadius(node.shape),
                        },
                    }));

                    // Convert AI edges to React Flow edges
                    const flowEdges = aiData.edges.map((edge, index) => ({
                        id: `edge-${index}`,
                        source: `node-${edge.fromNodeId}`,
                        target: `node-${edge.toNodeId}`,
                        label: edge.label,
                        type: 'smoothstep',
                    }));

                    setTitle(aiData.title);
                    setInitialNodes(flowNodes);
                    setInitialEdges(flowEdges);

                    // Clear sessionStorage sau khi đã đọc
                    sessionStorage.removeItem('aiGeneratedMindmap');
                } catch (error) {
                    console.error('Error parsing AI data:', error);
                }
            }
        }
    }, [fromAI]);

    const getShapeBorderRadius = (shape: string) => {
        switch (shape) {
            case 'ELLIPSE':
                return '50%';
            case 'ROUNDED_RECTANGLE':
                return '12px';
            case 'DIAMOND':
                return '0';
            default: // RECTANGLE
                return '4px';
        }
    };

    return (
        <div className="min-h-screen">
            {title && (
                <div className="p-4 bg-background border-b">
                    <h1 className="text-2xl font-bold">{title}</h1>
                </div>
            )}
            <MindMapEditor 
                nodes={initialNodes} 
                edges={initialEdges} 
                initialTitle={title}
            />
        </div>
    );
}
```

### 2. Cập nhật MindMapEditor component

Nếu `MindMapEditor` component chưa hỗ trợ `initialTitle` prop, thêm vào:

```tsx
interface MindMapEditorProps {
    nodes?: Node[];
    edges?: Edge[];
    initialTitle?: string;
}

export function MindMapEditor({ nodes = [], edges = [], initialTitle = 'Untitled Mind Map' }: MindMapEditorProps) {
    const [title, setTitle] = useState(initialTitle);
    // ... rest of component
}
```

### 3. Shape Mapping

Mapping giữa AI shapes và React Flow styles:

| AI Shape | React Flow Style |
|----------|------------------|
| RECTANGLE | `borderRadius: '4px'` |
| ROUNDED_RECTANGLE | `borderRadius: '12px'` |
| ELLIPSE | `borderRadius: '50%'` |
| DIAMOND | Custom CSS với `transform: rotate(45deg)` |

### 4. Custom Node Types (Optional)

Để có control tốt hơn về shapes, tạo custom node types:

```tsx
// components/mindmap-nodes/ShapeNode.tsx
import { Handle, Position } from '@xyflow/react';

export function ShapeNode({ data }) {
    const getShapeClass = (shape: string) => {
        switch (shape) {
            case 'ELLIPSE':
                return 'rounded-full';
            case 'ROUNDED_RECTANGLE':
                return 'rounded-xl';
            case 'DIAMOND':
                return 'rotate-45';
            default:
                return 'rounded';
        }
    };

    return (
        <div 
            className={`p-4 min-w-[150px] ${getShapeClass(data.shape)}`}
            style={{ backgroundColor: data.color }}
        >
            <Handle type="target" position={Position.Top} />
            <div className={data.shape === 'DIAMOND' ? '-rotate-45' : ''}>
                {data.label}
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}
```

Register node type:

```tsx
const nodeTypes = {
    shapeNode: ShapeNode,
};

// Khi convert nodes:
const flowNodes = aiData.nodes.map((node, index) => ({
    id: `node-${index}`,
    type: 'shapeNode', // Use custom node type
    position: { x: node.positionX, y: node.positionY },
    data: { 
        label: node.content,
        shape: node.shape,
        color: node.color,
    },
}));
```

### 5. Auto Layout (Optional)

Nếu positions từ API không tối ưu, sử dụng auto-layout:

```bash
npm install dagre
```

```tsx
import dagre from 'dagre';

const getLayoutedElements = (nodes, edges) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB' });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 150, height: 50 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x,
                y: nodeWithPosition.y,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};
```

### 6. Validation và Error Handling

```tsx
const validateAIData = (data: any): data is GenerateMindmapResponse => {
    return (
        data &&
        typeof data.title === 'string' &&
        Array.isArray(data.nodes) &&
        Array.isArray(data.edges) &&
        data.nodes.every((node: any) => 
            typeof node.content === 'string' &&
            typeof node.positionX === 'number' &&
            typeof node.positionY === 'number'
        )
    );
};

// Sử dụng:
if (aiDataStr) {
    const aiData = JSON.parse(aiDataStr);
    if (validateAIData(aiData)) {
        // Process data
    } else {
        console.error('Invalid AI data format');
    }
}
```

### 7. Testing

Test cases cần cover:
- [ ] Load mindmap từ AI với đầy đủ nodes và edges
- [ ] Load mindmap với chỉ có nodes, không có edges
- [ ] Handle invalid data format
- [ ] Handle missing sessionStorage data
- [ ] Handle các shape types khác nhau
- [ ] Clear sessionStorage sau khi load

### 8. User Flow

1. User vào `/ai` → Tạo mindmap với AI
2. AI trả về preview
3. User click "Tạo Mind Map"
4. Data lưu vào sessionStorage
5. Navigate đến `/mindmaps/new?from=ai`
6. Page load và đọc data từ sessionStorage
7. Render mindmap editor với data
8. Clear sessionStorage
9. User có thể edit và save mindmap

## Notes
- SessionStorage sẽ bị clear khi user close tab
- Nên thêm warning nếu user refresh page trước khi save
- Consider thêm option "Save as Draft" để không mất data
