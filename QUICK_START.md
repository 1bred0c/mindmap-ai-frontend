# 🚀 Quick Start Guide - Cosmic Theme

## Bắt đầu nhanh trong 5 phút!

### 📦 Cài đặt (nếu cần)

```bash
npm install
# hoặc
yarn install
```

### 🎨 Xem Theme Demo

1. **Chạy development server:**
```bash
npm run dev
```

2. **Mở trình duyệt và truy cập:**
- Homepage mới: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard`
- **Theme Showcase** (Demo đầy đủ): `http://localhost:3000/theme-showcase`

---

## 🎯 Sử dụng Theme trong Components

### 1️⃣ Cơ bản - Card với Glass Effect

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Beautiful Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Tự động có glass effect và neon glow!</p>
      </CardContent>
    </Card>
  );
}
```

### 2️⃣ Button với Icon Animation

```tsx
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

function MyButton() {
  return (
    <Button className="group">
      <Sparkles className="mr-2 group-hover:rotate-12 transition-transform" />
      Click Me
    </Button>
  );
}
```

### 3️⃣ Neural Node (cho Mindmap)

```tsx
import { NeuralNode } from '@/components/neural-node';
import { Brain } from 'lucide-react';

function MindmapNode() {
  return (
    <NeuralNode glowColor="cyan" size="md">
      <Brain className="h-6 w-6 text-cyan-400 mb-2" />
      <h3>Ý tưởng chính</h3>
      <p>Chi tiết ý tưởng...</p>
    </NeuralNode>
  );
}
```

### 4️⃣ Thêm Cosmic Background

```tsx
import { CosmicBackground } from '@/components/cosmic-background';

function MyPage() {
  return (
    <div className="min-h-screen">
      <CosmicBackground />
      
      <main className="relative z-10">
        {/* Nội dung của bạn */}
      </main>
    </div>
  );
}
```

---

## 🎨 Utility Classes Thông Dụng

### Text Effects
```tsx
<h1 className="text-glow-cyan">Cyan Glow</h1>
<h2 className="text-glow-purple">Purple Glow</h2>
<p className="text-glow-green">Green Glow</p>

<h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
  Gradient Text
</h1>
```

### Card Effects
```tsx
<div className="glass-card">Basic Glass Card</div>
<div className="glass-card-hover">With Hover Effect</div>
<div className="neon-border-purple">Purple Border Glow</div>
<div className="holographic">Holographic Effect</div>
```

### Animations
```tsx
<div className="animate-pulse-glow">Pulsing Glow</div>
<div className="animate-float">Floating</div>
<div className="animate-shimmer">Shimmer Effect</div>
```

---

## 🎯 Common Patterns

### Hero Section
```tsx
<div className="text-center space-y-8">
  <h1 className="text-6xl font-bold font-display">
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">
      Your Amazing Title
    </span>
  </h1>
  <p className="text-xl text-gray-400">
    Your description with <span className="text-cyan-400">highlighted text</span>
  </p>
</div>
```

### Stats Card
```tsx
<Card className="group">
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle className="text-sm text-gray-400">Total Users</CardTitle>
    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
      <Users className="h-4 w-4 text-cyan-400" />
    </div>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
      1,234
    </div>
  </CardContent>
</Card>
```

### Hover Card
```tsx
<Card className="hover-lift energy-field">
  <CardContent>
    Hover over me for cool effects!
  </CardContent>
</Card>
```

---

## 🎨 Color Reference

### Sử dụng trong className:
```tsx
// Background
className="bg-card"           // Card background
className="bg-background"     // Page background

// Text Colors
className="text-foreground"   // Normal text
className="text-gray-400"     // Muted text
className="text-cyan-400"     // Cyan accent
className="text-purple-400"   // Purple accent
className="text-emerald-400"  // Green accent

// Borders
className="border-white/10"      // Subtle border
className="border-purple-500/30" // Purple border
className="border-cyan-500/50"   // Cyan border
```

---

## 📱 Responsive Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Tự động responsive: 1 cột mobile, 2 tablet, 4 desktop */}
</div>
```

---

## 🔥 Pro Tips

### 1. Gradient Text
```tsx
<h1 className="font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
  Amazing Title
</h1>
```

### 2. Icon với Gradient Background
```tsx
<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
  <Icon className="h-6 w-6 text-cyan-400" />
</div>
```

### 3. Button Animation
```tsx
<Button className="group">
  <Icon className="mr-2 group-hover:scale-110 transition-transform duration-300" />
  Text
</Button>
```

### 4. Loading Spinner
```tsx
<div className="cosmic-spinner" />
// hoặc
<div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
```

---

## 🎬 Các Trang Demo

| Trang | URL | Mô tả |
|-------|-----|-------|
| Home | `/` | Landing page với cosmic theme |
| Dashboard | `/dashboard` | Dashboard với stats và cards |
| **Theme Showcase** | `/theme-showcase` | **Demo đầy đủ tất cả components** |

---

## 🐛 Troubleshooting

### Không thấy theme mới?
1. Xóa cache: `Ctrl + Shift + R` (Windows) hoặc `Cmd + Shift + R` (Mac)
2. Kiểm tra dark mode đã bật chưa
3. Restart dev server

### Font không load?
- Kiểm tra file `layout.tsx` đã import đúng fonts chưa
- Xóa `.next` folder và rebuild

### Animation không chạy?
- Kiểm tra `tailwind.config.ts` có cấu hình animation chưa
- Ensure `tailwindcss-animate` được cài đặt

---

## 📚 Tài liệu đầy đủ

- **Theme System**: `docs/THEME_SYSTEM.md`
- **Summary**: `COSMIC_THEME_SUMMARY.md`
- **Components**: Xem `/theme-showcase`

---

## 🎉 Kết quả

Bây giờ bạn có một **dashboard tech hiện đại** với:
- ✨ Glass morphism effects
- 🌟 Neon glow accents
- 🎬 Smooth animations
- 🎨 Neural network aesthetics
- 🌌 Cosmic background effects

**"Welcome to the universe of connected intelligence!"** 🚀
