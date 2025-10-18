# 🌌 Cosmic Mindmap Multi-Shape System

## Overview
Hệ thống node shapes với 10 hình dạng khác nhau, realtime sync với Supabase, và dark cosmic neon theme.

## 🎨 Supported Shapes

### 1. **RECTANGLE** (Default)
- Bo góc mềm mại, glow tím
- Phù hợp: nodes chính, headings
- Accent: `#8b5cf6` (purple)

### 2. **CIRCLE**
- Tròn hoàn toàn, glow cyan
- Phù hợp: endpoints, status nodes
- Accent: `#00ffff` (cyan)

### 3. **ELLIPSE**
- Oval ngang, glow xanh lá
- Phù hợp: process nodes, actions
- Accent: `#00ffb3` (green)

### 4. **DIAMOND**
- Xoay 45°, glow xanh dương nhạt
- Phù hợp: decision points
- Accent: `#22d3ee` (sky)

### 5. **HEXAGON**
- 6 cạnh, glow vàng
- Phù hợp: modules, components
- Accent: `#f59e0b` (amber)

### 6. **OCTAGON**
- 8 cạnh, glow đỏ
- Phù hợp: warnings, alerts
- Accent: `#ef4444` (red)

### 7. **PARALLELOGRAM**
- Nghiêng 15°, glow lime
- Phù hợp: data flow, inputs
- Accent: `#84cc16` (lime)

### 8. **TRAPEZOID**
- Hình thang, glow cam
- Phù hợp: storage, databases
- Accent: `#f97316` (orange)

### 9. **STAR**
- 5 cánh, SVG gradient
- Phù hợp: highlights, favorites
- Custom gradient per color

### 10. **CLOUD**
- Organic shape, SVG path
- Phù hợp: cloud services, thoughts
- Custom gradient per color

---

## 📦 Component Structure

```
components/
├── custom-node.tsx          # Main node renderer với 10 shapes
├── shape-selector.tsx       # UI selector trong edit dialog
└── mindmap-editor.tsx       # Updated editor với nodeTypes

hooks/
└── use-update-node-shape.ts # Hook để update shape -> Supabase

app/
└── node-shapes.css          # Cosmic neon styles cho tất cả shapes
```

---

## 🔌 Supabase Integration

### Database Schema
```sql
-- Bảng nodes cần có trường shape
ALTER TABLE nodes ADD COLUMN shape VARCHAR(20) DEFAULT 'RECTANGLE';

-- Allowed values
CHECK (shape IN (
  'RECTANGLE', 'CIRCLE', 'ELLIPSE', 'DIAMOND', 
  'HEXAGON', 'OCTAGON', 'PARALLELOGRAM', 'TRAPEZOID', 
  'STAR', 'CLOUD'
));
```

### Example Node JSON Response
```json
{
  "node_id": 123,
  "mind_map_id": 1,
  "content": "My Awesome Node",
  "position_x": 250.5,
  "position_y": 100.0,
  "color": "#8b5cf6",
  "shape": "HEXAGON",
  "created_at": "2025-01-15T10:30:00Z"
}
```

### React Flow Node State
```javascript
{
  id: "123",
  type: "customNode",
  data: {
    label: "My Awesome Node",
    shape: "HEXAGON",
    color: "#8b5cf6"
  },
  position: { x: 250.5, y: 100.0 }
}
```

---

## 🎯 Usage Examples

### 1. Update Node Shape (Manual)
```typescript
import { useUpdateNodeShape } from '@/hooks/use-update-node-shape';

const { updateNodeShape } = useUpdateNodeShape();

// Update single node
await updateNodeShape('123', 'STAR');
```

### 2. Batch Update Shapes
```typescript
const { batchUpdateNodeShapes } = useUpdateNodeShape();

await batchUpdateNodeShapes([
  { nodeId: '1', shape: 'CIRCLE' },
  { nodeId: '2', shape: 'DIAMOND' },
  { nodeId: '3', shape: 'STAR' }
]);
```

### 3. Realtime Sync Example
Khi user A thay đổi shape → Supabase realtime → User B thấy ngay lập tức:

```typescript
// User A updates
await supabase
  .from('nodes')
  .update({ shape: 'CLOUD' })
  .eq('node_id', '123');

// User B receives realtime event
supabase
  .channel('nodes-changes')
  .on('postgres_changes', { event: 'UPDATE', ... }, (payload) => {
    const n = payload.new;
    setNodes(prev => prev.map(node =>
      node.id === String(n.node_id)
        ? { ...node, data: { ...node.data, shape: n.shape } }
        : node
    ));
  })
  .subscribe();
```

---

## 🎨 Visual Effects

### Hover State
- Scale: `1.05` - `1.08`
- Glow intensity: +50%
- Smooth transition: `300ms`

### Selected State
- Border width: `3px`
- Glow intensity: +100%
- Pulsing animation: `2s infinite`

### Animation Keyframes
Mỗi shape có animation riêng:
- `pulse-purple` (Rectangle)
- `pulse-cyan` (Circle)
- `pulse-green` (Ellipse)
- `pulse-star` (Star SVG)
- `pulse-cloud` (Cloud SVG)

---

## 🚀 Quick Start

### 1. Import CSS
```typescript
import '@xyflow/react/dist/style.css';
import '../app/node-shapes.css';
```

### 2. Register Node Types
```typescript
const nodeTypes = useMemo(() => ({ 
  customNode: CustomNode 
}), []);

<ReactFlow nodeTypes={nodeTypes} ... />
```

### 3. Add Shape Selector to Edit Dialog
```typescript
import { ShapeSelector } from '@/components/shape-selector';

<ShapeSelector 
  selectedShape={nodeShape}
  onShapeChange={setNodeShape}
/>
```

---

## 🎭 Theme Customization

### Change Neon Colors
Edit `node-shapes.css`:

```css
.node-circle {
  box-shadow: 
    0 0 20px rgba(YOUR_COLOR, 0.5),
    inset 0 0 15px rgba(255, 255, 255, 0.1);
}
```

### Custom Shape Colors
Pass custom colors via node data:

```typescript
{
  id: "1",
  type: "customNode",
  data: {
    label: "Custom Color Node",
    shape: "STAR",
    color: "#ff00ff"  // Custom magenta
  },
  position: { x: 100, y: 100 }
}
```

---

## 🐛 Troubleshooting

### Shape không hiển thị
✅ Check `node-shapes.css` đã import
✅ Verify `nodeTypes` registered trong ReactFlow
✅ Confirm `shape` field exists trong Supabase

### Realtime sync không hoạt động
✅ Check Supabase realtime enabled cho table `nodes`
✅ Verify RLS policies cho UPDATE operations
✅ Confirm channel subscription active

### CSS animations lag
✅ Use `transform` thay vì `width/height`
✅ Enable GPU acceleration: `will-change: transform`
✅ Reduce box-shadow blur radius

---

## 📊 Performance Tips

1. **Memo Components**: CustomNode đã wrapped trong `memo`
2. **Lazy Load SVGs**: Star & Cloud render conditionally
3. **CSS Transforms**: Hardware-accelerated animations
4. **Debounce Updates**: Batch position updates khi drag
5. **Optimize Selectors**: Sử dụng CSS classes thay inline styles

---

## 🔮 Future Enhancements

- [ ] Custom shape builder (user-defined paths)
- [ ] Shape presets/templates
- [ ] Animated shape transitions
- [ ] 3D perspective effects
- [ ] Gradient editor UI
- [ ] Shape import/export (SVG)

---

## 📝 License
MIT - Feel free to customize for your cosmic mindmap! 🌌

---

**Built with ❤️ using React Flow + Supabase + Tailwind CSS**
