# Quy trình tạo Mind Map từ AI

## 📋 Tổng quan

Quy trình tạo mindmap từ AI được thiết kế để người dùng có thể xem preview, tùy chỉnh thông tin, và sau đó tạo mindmap thực sự trong database.

## 🔄 Quy trình hoàn chỉnh

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Trang /ai - AI Mind Map Generator                           │
├─────────────────────────────────────────────────────────────────┤
│ • User nhập prompt mô tả mindmap                                │
│ • Chọn AI model (Gemini/ChatGPT)                               │
│ • Click "Tạo Mind Map"                                          │
│ • AI trả về: title, nodes[], edges[]                           │
│ • Hiển thị preview đầy đủ                                       │
│ • User xem và quyết định tạo                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Click "Tạo Mind Map"
                              ↓
                    Lưu vào sessionStorage
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Trang /mindmaps/new?from=ai - Create Mind Map Form          │
├─────────────────────────────────────────────────────────────────┤
│ • Load dữ liệu AI từ sessionStorage                             │
│ • Pre-fill title từ AI                                          │
│ • User chọn workspace                                           │
│ • User có thể chỉnh sửa title, description                      │
│ • User click "Create Mind Map"                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                      Call Backend API
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Tạo Mindmap trong Database                                   │
├─────────────────────────────────────────────────────────────────┤
│ POST /api/v1/mindmap?ownerId={userId}                          │
│ {                                                               │
│   title: string,                                                │
│   description: string,                                          │
│   workspaceId: number,                                          │
│   public: boolean                                               │
│ }                                                               │
│ → Response: { mindMapId, title, description, ... }             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                      Nhận mindMapId mới
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Tạo Nodes từ AI Data (Supabase)                             │
├─────────────────────────────────────────────────────────────────┤
│ for each node in aiData.nodes:                                 │
│   • Insert vào table `nodes`                                    │
│   • Nhận node_id thực                                           │
│   • Map: tempIndex → realNodeId                                 │
│                                                                 │
│ supabase.from('nodes').insert({                                │
│   mind_map_id: mindMapId,                                      │
│   content: node.content,                                       │
│   position_x: node.positionX,                                  │
│   position_y: node.positionY,                                  │
│   color: node.color,                                           │
│   shape: node.shape                                            │
│ })                                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                      Map node IDs
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. Tạo Edges từ AI Data (Supabase)                             │
├─────────────────────────────────────────────────────────────────┤
│ for each edge in aiData.edges:                                 │
│   • Map fromNodeId từ index → real node_id                      │
│   • Map toNodeId từ index → real node_id                        │
│   • Insert vào table `edges`                                    │
│                                                                 │
│ supabase.from('edges').insert({                                │
│   mind_map_id: mindMapId,                                      │
│   from_node_id: realFromId,                                    │
│   to_node_id: realToId,                                        │
│   label: edge.label                                            │
│ })                                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Clear sessionStorage
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. Hiển thị MindMapEditor                                       │
├─────────────────────────────────────────────────────────────────┤
│ • Component MindMapEditor render                                │
│ • Load nodes và edges từ Supabase                              │
│ • User có thể chỉnh sửa, thêm, xóa                             │
│ • Realtime sync với Supabase                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Cấu trúc dữ liệu

### AI Response (từ backend)
```typescript
interface GenerateMindmapResponse {
  title: string;
  nodes: GeneratedNode[];
  edges: GeneratedEdge[];
}

interface GeneratedNode {
  content: string;
  parentNodeId: number | null;  // Not used in current flow
  positionX: number;
  positionY: number;
  color: string;
  shape: NodeShape;
}

interface GeneratedEdge {
  fromNodeId: number;  // Index trong mảng nodes (0-based)
  toNodeId: number;    // Index trong mảng nodes (0-based)
  label: string;
}
```

### SessionStorage Data
```typescript
interface AIGeneratedData {
  title: string;
  nodes: AIGeneratedNode[];
  edges: AIGeneratedEdge[];
  prompt?: string;  // Original user prompt
}

// Key: 'aiGeneratedMindmap'
```

### Database Schema

**Table: `mindmaps`**
```sql
mind_map_id: integer (PK)
title: varchar
description: text
workspace_id: integer (FK)
owner_id: integer (FK)
public: boolean
created_at: timestamp
updated_at: timestamp
```

**Table: `nodes`**
```sql
node_id: integer (PK)
mind_map_id: integer (FK)
content: varchar
position_x: float
position_y: float
color: varchar
shape: varchar  -- RECTANGLE, ELLIPSE, DIAMOND, etc.
created_at: timestamp
```

**Table: `edges`**
```sql
edge_id: integer (PK)
mind_map_id: integer (FK)
from_node_id: integer (FK)
to_node_id: integer (FK)
label: varchar
created_at: timestamp
```

## 🔑 Key Points

### 1. ID Mapping
- AI backend trả về `fromNodeId` và `toNodeId` là **index** trong mảng (0-based)
- Khi tạo nodes, ta nhận được `node_id` thực từ database
- Cần map: `nodeIdMap[index] = realNodeId`
- Khi tạo edges, dùng mapping để lấy real IDs

### 2. Error Handling
- Nếu tạo node thất bại → skip và tiếp tục
- Nếu edge không tìm thấy mapping → skip edge đó
- Log chi tiết lỗi để debug
- Hiển thị toast với số lượng nodes/edges thành công

### 3. Loading States
```
1. isGenerating: AI đang generate (trang /ai)
2. loading: Đang tạo mindmap record
3. isCreatingNodes: Đang tạo nodes & edges từ AI
```

### 4. Toast Notifications
```
1. "Thành công!" - AI generate xong
2. "Đang chuyển hướng..." - Navigate to /mindmaps/new
3. "Mind map created successfully!" - Mindmap record created
4. "Đang tạo nodes và edges từ AI..." - Creating nodes/edges
5. "Đã tạo X nodes và Y edges!" - Final success
```

## 🐛 Debug Tips

### Check Console Logs
```javascript
// Trang AI
console.log('🤖 AI Response:', data);
console.log('📊 Nodes count:', data.nodes?.length);
console.log('🔗 Edges count:', data.edges?.length);

// Trang /mindmaps/new
console.log('📝 Creating nodes for mindMapId:', mindMapId);
console.log('📝 Nodes to create:', aiData.nodes);
console.log(`Creating node ${i}:`, nodeData);
console.log(`✅ Node ${i} created with ID:`, data.node_id);
console.log('🗺️ Node ID mapping:', Array.from(nodeIdMap.entries()));
console.log('🔗 Creating edges...');
console.log(`Edge: ${edge.fromNodeId} -> ${edge.toNodeId}`, mapping);
```

### Check SessionStorage
```javascript
// Browser DevTools Console
sessionStorage.getItem('aiGeneratedMindmap')
JSON.parse(sessionStorage.getItem('aiGeneratedMindmap'))
```

### Check Supabase
```sql
-- Check nodes
SELECT * FROM nodes WHERE mind_map_id = YOUR_ID;

-- Check edges
SELECT * FROM edges WHERE mind_map_id = YOUR_ID;

-- Check relationships
SELECT 
  e.edge_id,
  n1.content as from_node,
  n2.content as to_node,
  e.label
FROM edges e
JOIN nodes n1 ON e.from_node_id = n1.node_id
JOIN nodes n2 ON e.to_node_id = n2.node_id
WHERE e.mind_map_id = YOUR_ID;
```

## ⚠️ Common Issues

### Issue 1: Nodes không được tạo
**Possible causes:**
- Supabase RLS (Row Level Security) chặn insert
- Missing required fields
- Invalid shape values
- Network error

**Solution:**
- Check error logs trong console
- Verify Supabase policies
- Check field validation

### Issue 2: Edges không được tạo
**Possible causes:**
- Node ID mapping sai
- fromNodeId/toNodeId không tồn tại
- Foreign key constraint failed

**Solution:**
- Check console log của node mapping
- Verify edge indices match node array
- Check database constraints

### Issue 3: SessionStorage empty
**Possible causes:**
- Browser cleared storage
- Different domain/tab
- Navigation before save

**Solution:**
- Verify data saved before navigation
- Check browser console for errors
- Use localStorage as fallback if needed

## 🚀 Future Improvements

- [ ] Add progress bar cho việc tạo nodes/edges
- [ ] Batch insert nodes/edges (faster)
- [ ] Retry logic cho failed operations
- [ ] Save draft mindmaps
- [ ] Preview mindmap visual trước khi tạo
- [ ] Export/Import AI mindmap JSON
- [ ] Template library cho common structures
- [ ] Undo/Redo support
- [ ] Real-time collaboration during creation

## 📝 Testing Checklist

- [ ] AI generates valid response
- [ ] Preview hiển thị đúng nodes và edges
- [ ] Navigate to /mindmaps/new với data
- [ ] Title và description được pre-fill
- [ ] Mindmap được tạo thành công
- [ ] Nodes được insert với đúng data
- [ ] Node ID mapping hoạt động
- [ ] Edges được tạo với đúng relationships
- [ ] SessionStorage được clear sau khi xong
- [ ] MindMapEditor load và hiển thị đúng
- [ ] Realtime sync hoạt động
- [ ] Error handling đúng cho tất cả cases
