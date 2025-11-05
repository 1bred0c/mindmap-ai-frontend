# 🔍 Vị trí nút chuyển ngôn ngữ

## 📍 Nút ở đâu?

### 1️⃣ **Trang chủ** (`/`)
```
┌─────────────────────────────────────────────────────┐
│  🧠 Logo              [🌐 EN 🇬🇧 ▼]  [Login] [Sign Up] │
│                                                     │
│            Organize Your Ideas...                   │
└─────────────────────────────────────────────────────┘
```
**Vị trí**: Góc phải navigation bar, bên trái nút Login

---

### 2️⃣ **Trang Login** (`/auth/login`)
```
┌─────────────────────────────────────────────┐
│                              [🌐 EN 🇬🇧 ▼]  │ ← Góc phải trên cùng
│                                             │
│              🧠 Logo                         │
│        ┌─────────────────┐                  │
│        │  Welcome Back   │                  │
│        │                 │                  │
│        │  [Email]        │                  │
│        │  [Password]     │                  │
│        └─────────────────┘                  │
└─────────────────────────────────────────────┘
```
**Vị trí**: Góc phải trên cùng, floating position

---

### 3️⃣ **Trang Signup** (`/auth/signup`)
```
┌─────────────────────────────────────────────┐
│                              [🌐 EN 🇬🇧 ▼]  │ ← Góc phải trên cùng
│                                             │
│              🧠 Logo                         │
│        ┌─────────────────┐                  │
│        │ Create Account  │                  │
│        │                 │                  │
│        │  [Name]         │                  │
│        │  [Email]        │                  │
│        └─────────────────┘                  │
└─────────────────────────────────────────────┘
```
**Vị trí**: Góc phải trên cùng, floating position

---

### 4️⃣ **Dashboard** (`/dashboard`)
```
┌─────────────────────────────────────────────────────────────┐
│  👤 Avatar  [🌐 EN 🇬🇧 ▼]  [🌓 Theme]  [Logout]              │
│                                                             │
│  📊 Dashboard                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │ Workspace│ │ Mind Maps│ │ Members  │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
└─────────────────────────────────────────────────────────────┘
```
**Vị trí**: Header bar, giữa Avatar và Theme toggle

---

### 5️⃣ **Mind Map Editor** (`/mindmaps/[id]`)
```
┌─────────────────────────────────────────────────────────────┐
│  [← Back]        My Mind Map        [Add] [Save]            │
│                                                             │
│  🧠 ○────○                                                  │
│      │                                                      │
│      ○────○                                                 │
└─────────────────────────────────────────────────────────────┘
```
**Vị trí**: Trong Dashboard layout header

---

## 🎯 Cách tìm nút nhanh:

### Desktop (màn hình lớn):
1. ✅ Tìm **góc phải** màn hình
2. ✅ Tìm icon **🌐** (Languages icon)
3. ✅ Sẽ thấy text: **"🇬🇧 English"** hoặc **"🇻🇳 Tiếng Việt"**

### Mobile (màn hình nhỏ):
1. ✅ Tìm **góc phải** màn hình  
2. ✅ Chỉ thấy icon **🌐 🇬🇧** (không có text)

---

## 🖼️ Hình dạng nút:

### Trạng thái bình thường:
```
┌──────────────────┐
│ 🌐 English 🇬🇧 ▼ │
└──────────────────┘
```

### Khi hover (di chuột qua):
```
┌──────────────────┐
│ 🌐 English 🇬🇧 ▼ │ ← Background gradient sáng lên
└──────────────────┘
```

### Khi click - Dropdown mở ra:
```
┌──────────────────┐
│ 🌐 English 🇬🇧 ▼ │
└──────────────────┘
   ↓
┌──────────────────┐
│ 🇬🇧 English    ✓ │ ← Đang chọn
│ 🇻🇳 Tiếng Việt   │
└──────────────────┘
```

---

## 🚨 Nếu không thấy nút:

### Checklist:
- [ ] Đã chạy `npm run dev` chưa?
- [ ] Đang ở trang nào? (xem list phía trên)
- [ ] Scroll lên đầu trang chưa?
- [ ] Màn hình đủ rộng không? (>640px để thấy full text)
- [ ] Clear cache browser: `Ctrl + Shift + R` (Windows) hoặc `Cmd + Shift + R` (Mac)

### Nếu vẫn không thấy:
```bash
# 1. Stop server
Ctrl + C

# 2. Clear cache & rebuild
rm -rf .next
npm run build
npm run dev

# 3. Hard reload browser
Ctrl + Shift + R
```

---

## 🎨 Màu sắc nút:

- **Icon**: Màu xám/trắng (tùy theme)
- **Background khi hover**: Gradient Purple (#a855f7) → Cyan (#06b6d4)
- **Dropdown**: Glass morphism với backdrop blur
- **Checkmark**: Màu primary (Purple)

---

## 📱 Responsive:

| Screen Size | Display |
|-------------|---------|
| < 640px (Mobile) | 🌐 🇬🇧 (chỉ icon + flag) |
| ≥ 640px (Desktop) | 🌐 English 🇬🇧 (full text) |

---

## 🎬 Demo URLs:

Test ngay tại các trang sau:
- ✅ http://localhost:3000 (Home)
- ✅ http://localhost:3000/auth/login (Login)
- ✅ http://localhost:3000/auth/signup (Signup)
- ✅ http://localhost:3000/dashboard (Dashboard - cần login)
- ✅ http://localhost:3000/language-demo (Demo page)

---

## 💡 Tips:

1. **Nút luôn ở góc phải** - dễ tìm nhất
2. **Icon 🌐 rất dễ nhận diện** - tìm icon này
3. **Có animation** - di chuột qua sẽ thấy hiệu ứng
4. **Persistent** - đổi ngôn ngữ 1 lần, áp dụng toàn app

---

**Chúc bạn tìm thấy nút! 🎉**
