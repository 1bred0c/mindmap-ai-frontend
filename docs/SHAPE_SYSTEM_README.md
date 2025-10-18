# 🌌 Cosmic Mindmap - Multi-Shape Node System

## ✨ Features Implemented

✅ **10 Unique Node Shapes**
- RECTANGLE, CIRCLE, ELLIPSE, DIAMOND
- HEXAGON, OCTAGON, PARALLELOGRAM, TRAPEZOID
- STAR (SVG), CLOUD (SVG)

✅ **Dark Cosmic Neon Theme**
- Neon glow effects với accent colors (cyan, purple, green, etc.)
- Hover: Scale + Glow tăng
- Selected: Pulsing animation
- Backdrop blur + gradient overlays

✅ **Supabase Realtime Sync**
- Update shape → Instant sync across clients
- Optimistic local updates
- Batch update support

✅ **User-Friendly UI**
- Shape selector trong edit dialog
- Visual shape icons
- Color picker integration
- Drag-and-drop nodes

---

## 📦 File Structure

```
components/
├── custom-node.tsx           # 🎨 Main node renderer (10 shapes)
├── shape-selector.tsx        # 🎯 UI để chọn shape
└── mindmap-editor.tsx        # 🖼️ Updated editor với nodeTypes

hooks/
└── use-update-node-shape.ts  # 🔄 Hook update shape vào DB

app/
└── node-shapes.css           # 💅 Cosmic neon styles

docs/
├── NODE_SHAPES_GUIDE.md      # 📚 Full documentation
├── supabase_shape_migration.sql  # 🗄️ DB migration script
└── shape-examples.ts         # 💡 Usage examples
```

---

## 🚀 Quick Start

### 1. Run Database Migration
```sql
-- Copy nội dung từ docs/supabase_shape_migration.sql
-- Paste vào Supabase SQL Editor
-- Run migration
```

### 2. Code đã tích hợp sẵn!
Tất cả đã được cập nhật trong `mindmap-editor.tsx`:
- ✅ Import CustomNode
- ✅ Register nodeTypes
- ✅ Load shapes từ DB
- ✅ Shape selector trong dialog
- ✅ Realtime sync

### 3. Test thử
```bash
# Start dev server
npm run dev

# Mở mindmap editor
# Click vào node → Chọn shape mới → Save
# Kiểm tra realtime sync với tab khác
```

---

## 🎨 Visual Preview

### Shape Gallery
```
RECTANGLE   ▭  Purple glow    (Default, headings)
CIRCLE      ●  Cyan glow      (Endpoints, status)
ELLIPSE     ⬭  Green glow     (Process, actions)
DIAMOND     ◆  Sky glow       (Decisions)
HEXAGON     ⬡  Amber glow     (Modules, APIs)
OCTAGON     ⯄  Red glow       (Warnings, alerts)
PARALLELOGRAM ▱ Lime glow     (Data flow)
TRAPEZOID   ⏢  Orange glow    (Storage, DBs)
STAR        ★  Gradient       (Highlights)
CLOUD       ☁  Gradient       (Cloud services)
```

### Behavior
- **Normal**: Subtle neon glow
- **Hover**: Scale 105-108%, glow +50%
- **Selected**: Border 3px, glow +100%, pulse animation
- **Drag**: Smooth position updates

---

## 🔌 API Usage

### Update Single Node Shape
```typescript
import { useUpdateNodeShape } from '@/hooks/use-update-node-shape';

const { updateNodeShape } = useUpdateNodeShape();

await updateNodeShape('nodeId', 'STAR');
```

### Batch Update
```typescript
const { batchUpdateNodeShapes } = useUpdateNodeShape();

await batchUpdateNodeShapes([
  { nodeId: '1', shape: 'CIRCLE' },
  { nodeId: '2', shape: 'HEXAGON' }
]);
```

### Direct Supabase
```typescript
await supabase
  .from('nodes')
  .update({ shape: 'CLOUD', color: '#06b6d4' })
  .eq('node_id', nodeId);
```

---

## 📊 Database Schema

### nodes table
```sql
node_id       SERIAL PRIMARY KEY
mind_map_id   INTEGER REFERENCES mind_maps(id)
content       VARCHAR(255)
position_x    FLOAT
position_y    FLOAT
color         VARCHAR(7)
shape         VARCHAR(20) DEFAULT 'RECTANGLE'  -- ✨ NEW
created_at    TIMESTAMP
updated_at    TIMESTAMP
```

### Valid shapes
```sql
CHECK (shape IN (
  'RECTANGLE', 'CIRCLE', 'ELLIPSE', 'DIAMOND',
  'HEXAGON', 'OCTAGON', 'PARALLELOGRAM', 'TRAPEZOID',
  'STAR', 'CLOUD'
))
```

---

## 🎯 Use Cases

### Flowchart
- **Start/End**: CIRCLE (cyan)
- **Process**: RECTANGLE (purple)
- **Decision**: DIAMOND (sky)

### Architecture Diagram
- **Frontend**: HEXAGON (amber)
- **Backend**: HEXAGON (green)
- **Database**: TRAPEZOID (orange)
- **Cache**: ELLIPSE (cyan)
- **Cloud**: CLOUD (blue)
- **Warning**: OCTAGON (red)

### Mind Mapping
- **Main Idea**: CIRCLE (large)
- **Sub Ideas**: RECTANGLE
- **Important**: STAR (yellow)
- **Notes**: CLOUD (light blue)
- **Tasks**: PARALLELOGRAM

---

## 🎨 Theme Customization

### Change Shape Colors
Edit `node-shapes.css`:
```css
.node-circle {
  box-shadow: 
    0 0 20px rgba(YOUR_R, YOUR_G, YOUR_B, 0.5),
    inset 0 0 15px rgba(255, 255, 255, 0.1);
}
```

### Custom Animations
```css
@keyframes pulse-custom {
  0%, 100% {
    box-shadow: 0 0 40px var(--node-color);
  }
  50% {
    box-shadow: 0 0 70px var(--node-color);
  }
}
```

---

## 🐛 Troubleshooting

### Shapes không hiển thị?
✅ Check `node-shapes.css` imported trong editor  
✅ Verify `nodeTypes={{ customNode: CustomNode }}` registered  
✅ Confirm `type: 'customNode'` trong node data  

### Realtime không sync?
✅ Enable Supabase realtime cho table `nodes`  
✅ Check RLS policies (SELECT, UPDATE permissions)  
✅ Verify channel subscription active  

### Performance issues?
✅ Limit nodes < 100 per canvas  
✅ Debounce position updates (đã implement)  
✅ Use `memo` cho components (đã implement)  

---

## 📝 Next Steps

### Bạn có thể mở rộng:
- [ ] Context menu: Right-click → Change shape
- [ ] Keyboard shortcuts: `Ctrl+1-9` cho shapes
- [ ] Shape templates/presets
- [ ] Auto-assign shapes dựa vào content
- [ ] Shape morphing animation
- [ ] Custom SVG import
- [ ] 3D perspective effects

---

## 🌟 Demo Scenarios

### Test Realtime Sync
1. Mở 2 browser tabs cùng 1 mindmap
2. Tab 1: Change node shape → STAR
3. Tab 2: Ngay lập tức thấy node đổi thành STAR ⚡

### Test All Shapes
1. Add 10 nodes
2. Assign mỗi node 1 shape khác nhau
3. Change colors
4. Drag để xem hover effects
5. Click để xem selected state

---

## 📚 Documentation

Xem chi tiết:
- **Full Guide**: `docs/NODE_SHAPES_GUIDE.md`
- **SQL Migration**: `docs/supabase_shape_migration.sql`
- **Examples**: `docs/shape-examples.ts`

---

## 🎉 Summary

Bạn đã có:
✅ 10 shapes với dark cosmic neon theme  
✅ Supabase realtime sync  
✅ User-friendly UI  
✅ Full documentation  
✅ Migration scripts  
✅ Examples  

**Enjoy your cosmic mindmap! 🚀🌌**
