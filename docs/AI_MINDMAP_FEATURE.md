# Tài liệu tính năng AI Mind Map Generator

## Tổng quan
Tính năng AI Mind Map Generator cho phép người dùng tạo cấu trúc mind map tự động bằng cách sử dụng AI (Google Gemini hoặc ChatGPT) dựa trên mô tả văn bản.

## Các tính năng chính

### 1. Nhập liệu và lựa chọn AI Model
- Người dùng có thể nhập mô tả chi tiết về chủ đề mind map
- Lựa chọn AI Model: Google Gemini (mặc định) hoặc ChatGPT
- Hiển thị số ký tự đã nhập
- Validate input trước khi gửi

### 2. Gọi API tạo Mind Map
**Endpoint:** `POST /api/v1/ai/generate-mindmap`

**Request:**
```json
{
  "prompt": "string",
  "llmModel": "GEMINI" | "CHATGPT"
}
```

**Response:**
```json
{
  "title": "string",
  "nodes": [
    {
      "content": "string",
      "parentNodeId": number | null,
      "positionX": number,
      "positionY": number,
      "color": "string",
      "shape": "RECTANGLE" | "ELLIPSE" | "DIAMOND" | "ROUNDED_RECTANGLE"
    }
  ],
  "edges": [
    {
      "fromNodeId": number,
      "toNodeId": number,
      "label": "string"
    }
  ]
}
```

### 3. Loading State
- Hiển thị spinner animation trong khi đang tạo
- Thông báo "Đang tạo... (có thể mất 5-15s)"
- Disable button và input trong khi đang xử lý

### 4. Error Handling
- Hiển thị thông báo lỗi rõ ràng khi API fail
- Icon cảnh báo và message user-friendly
- Button "Thử lại" để người dùng có thể thử lại

### 5. Hiển thị kết quả
- **Preview Title:** Tiêu đề mind map từ AI
- **Danh sách Nodes:** 
  - Hiển thị tất cả nodes với số thứ tự
  - Màu sắc node
  - Shape (hình dạng)
  - Parent node ID (nếu có)
  - Tọa độ (x, y)
  - Scrollable nếu quá nhiều nodes
- **Danh sách Edges (kết nối):**
  - Hiển thị connection giữa các nodes
  - Label của connection (nếu có)
  - Format: Node A → Node B

### 6. Quick Start Templates
- Các mẫu có sẵn để người dùng bắt đầu nhanh:
  - Project Planning
  - Learning Path
  - Marketing Strategy
  - Team Structure
- Click vào template sẽ tự động điền nội dung

### 7. Actions
- **Tạo mới:** Clear kết quả và bắt đầu lại
- **Tạo Mind Map:** Lưu dữ liệu vào sessionStorage và chuyển đến trang tạo mind map thực tế

## Cấu trúc Code

### Types định nghĩa
```typescript
type LLMModel = 'GEMINI' | 'CHATGPT';
type NodeShape = 'RECTANGLE' | 'ELLIPSE' | 'DIAMOND' | 'ROUNDED_RECTANGLE';

interface GeneratedNode {
  content: string;
  parentNodeId: number | null;
  positionX: number;
  positionY: number;
  color: string;
  shape: NodeShape;
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
```

### State Management
```typescript
const [inputText, setInputText] = useState('');
const [selectedModel, setSelectedModel] = useState<LLMModel>('GEMINI');
const [isGenerating, setIsGenerating] = useState(false);
const [generatedData, setGeneratedData] = useState<GenerateMindmapResponse | null>(null);
const [error, setError] = useState<string | null>(null);
```

### Main Functions

#### handleGenerate()
- Validate input
- Gọi API với fetch
- Xử lý response và errors
- Hiển thị toast notifications

#### handleUseSuggestion(suggestion)
- Fill input với template text

#### createMindMap()
- Lưu dữ liệu vào sessionStorage
- Navigate đến `/mindmaps/new?from=ai`

#### handleRegenerateNew()
- Clear tất cả state để tạo mới

## Environment Variables
Cần thêm vào `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## UI Components sử dụng
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Button`
- `Textarea`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `Badge`
- `useToast` hook
- Icons: `Sparkles`, `Brain`, `Lightbulb`, `TrendingUp`, `Users`, `Target`, `Loader2`, `CheckCircle2`, `AlertCircle`

## Flow hoàn chỉnh

1. **User nhập mô tả** → Chọn AI model → Click "Tạo Mind Map"
2. **Loading state** → Hiển thị spinner và message
3. **API call** → POST request đến backend
4. **Success:**
   - Hiển thị preview với title, nodes, edges
   - User có thể xem chi tiết hoặc tạo mới
   - Click "Tạo Mind Map" → Chuyển đến editor
5. **Error:**
   - Hiển thị error message
   - Option để thử lại

## Tích hợp với trang Mindmap Editor
Khi user click "Tạo Mind Map", dữ liệu được:
1. Lưu vào `sessionStorage` với key `aiGeneratedMindmap`
2. Navigate đến `/mindmaps/new?from=ai`
3. Trang editor sẽ đọc data từ sessionStorage và render mind map

## Notes quan trọng
- ⚠️ API response có thể mất 5-15 giây
- ⚠️ Cần implement timeout và retry logic nếu cần
- ⚠️ Node IDs trong response chỉ là temporary IDs cho preview
- ⚠️ Khi tạo mindmap thực tế, cần map sang IDs thật trong database
- ⚠️ Cần thêm authentication header (X-User-Id) khi có user context

## Cải tiến tương lai
- [ ] Thêm option để customize số lượng nodes
- [ ] Preview visual của mind map trước khi tạo
- [ ] Save/bookmark các prompts thường dùng
- [ ] History của các mind maps đã tạo
- [ ] Rate limiting và quota management
- [ ] Streaming response để hiển thị progress
