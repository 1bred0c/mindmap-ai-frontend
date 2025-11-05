# 🌐 Hệ thống Đa ngôn ngữ (Internationalization)

## 📋 Tổng quan

Dự án này đã được tích hợp hệ thống đa ngôn ngữ chuyên nghiệp, hỗ trợ:
- 🇬🇧 **Tiếng Anh (English)** - Ngôn ngữ mặc định
- 🇻🇳 **Tiếng Việt** - Ngôn ngữ thứ hai

## 🎯 Tính năng

- ✅ Chuyển đổi ngôn ngữ liền mạch với animation hiện đại
- ✅ Lưu trữ lựa chọn ngôn ngữ vào localStorage
- ✅ UI/UX thân thiện với dropdown menu đẹp mắt
- ✅ Icon cờ quốc gia trực quan
- ✅ Tích hợp vào tất cả các trang chính
- ✅ Toast notifications được dịch
- ✅ Responsive design cho mọi thiết bị

## 🗂️ Cấu trúc file

```
mindmap-ai-frontend/
├── contexts/
│   └── language-context.tsx          # Context & Provider cho ngôn ngữ
├── components/
│   └── language-toggle.tsx            # Component nút chuyển đổi ngôn ngữ
├── locales/
│   ├── en.json                        # Bản dịch tiếng Anh
│   └── vi.json                        # Bản dịch tiếng Việt
└── app/
    └── layout.tsx                     # Root layout với LanguageProvider
```

## 🚀 Sử dụng

### 1. Sử dụng hook trong component

```tsx
'use client';

import { useLanguage } from '@/contexts/language-context';

export default function MyComponent() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.description')}</p>
    </div>
  );
}
```

### 2. Thêm bản dịch mới

#### Cập nhật `locales/en.json`:
```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my feature"
  }
}
```

#### Cập nhật `locales/vi.json`:
```json
{
  "myFeature": {
    "title": "Tính năng của tôi",
    "description": "Đây là tính năng của tôi"
  }
}
```

### 3. Sử dụng trong code:
```tsx
const title = t('myFeature.title');
const description = t('myFeature.description');
```

## 🎨 Component Language Toggle

Component `<LanguageToggle />` đã được tích hợp vào:
- ✅ Trang chủ (Navigation bar)
- ✅ Dashboard Layout (Header)
- ✅ Tất cả các trang con của dashboard

### Vị trí hiển thị:
- **Desktop**: Hiển thị đầy đủ với icon + text + cờ
- **Mobile**: Chỉ hiển thị icon + cờ để tiết kiệm không gian

## 📝 Quy tắc đặt tên key

Sử dụng cấu trúc phân cấp rõ ràng:

```
<feature>.<page>.<element>.<property>
```

**Ví dụ:**
- `home.title` - Tiêu đề trang chủ
- `auth.login.email` - Label email trong trang đăng nhập
- `mindmap.editor.addNode` - Nút thêm node trong editor
- `common.save` - Nút lưu chung

## 🎭 Các trang đã được dịch

### ✅ Hoàn thành
- [x] Trang chủ (Home Page)
- [x] Trang đăng nhập (Login Page)
- [x] Trang đăng ký (Signup Page)
- [x] Dashboard
- [x] Mind Map Editor
- [x] Pricing Page
- [x] Navigation & Layout

### 🔄 Đang phát triển
- [ ] Profile Page
- [ ] Settings Page
- [ ] Admin Page
- [ ] AI Page
- [ ] Workspace Pages

## 🌟 Best Practices

1. **Luôn sử dụng `t()` function** thay vì hard-code text
2. **Thêm key mới vào cả 2 file** `en.json` và `vi.json`
3. **Sử dụng key rõ ràng và mô tả** để dễ maintain
4. **Test cả 2 ngôn ngữ** sau khi thêm feature mới
5. **Không để trống value** trong file translation

## 🔧 API Reference

### `useLanguage()` Hook

```tsx
const { language, setLanguage, t } = useLanguage();
```

#### Properties:
- `language`: `'en' | 'vi'` - Ngôn ngữ hiện tại
- `setLanguage(lang)`: Function để đổi ngôn ngữ
- `t(key)`: Function để lấy bản dịch theo key

## 💡 Tips

1. **Fallback**: Nếu key không tìm thấy, sẽ trả về key đó
2. **Nested keys**: Hỗ trợ keys lồng nhau với dấu `.`
3. **Dynamic content**: Sử dụng template strings với `t()`

```tsx
const message = `${t('welcome')} ${userName}!`;
```

## 🐛 Troubleshooting

### Lỗi: Translation không hiển thị
- ✅ Kiểm tra key có tồn tại trong cả 2 file en.json và vi.json
- ✅ Kiểm tra component có wrap trong `<LanguageProvider>`
- ✅ Kiểm tra import `useLanguage` đúng path

### Lỗi: Ngôn ngữ không lưu sau khi reload
- ✅ Kiểm tra localStorage có hoạt động không
- ✅ Kiểm tra browser console có lỗi không

## 🎨 UI/UX Design

### Language Toggle Button
- **Icon**: 🌐 Languages icon với animation xoay khi hover
- **Gradient**: Purple to Cyan gradient background khi hover
- **Dropdown**: Backdrop blur với animation fade-in
- **Check mark**: Hiển thị checkmark ở ngôn ngữ đang chọn
- **Responsive**: Tự động ẩn text trên màn hình nhỏ

### Color Scheme
- Primary: Purple (#a855f7)
- Secondary: Cyan (#06b6d4)
- Text: Adaptive based on theme (dark/light)

## 📱 Responsive Design

| Screen Size | Display Style |
|-------------|---------------|
| < 640px     | Icon + Flag only |
| ≥ 640px     | Icon + Flag + Text |

## 🚀 Future Enhancements

- [ ] Thêm ngôn ngữ thứ 3 (Nhật, Hàn, Pháp...)
- [ ] Auto-detect ngôn ngữ từ browser
- [ ] RTL support cho ngôn ngữ Arabic
- [ ] Pluralization support
- [ ] Date/Number formatting theo locale

## 📞 Support

Nếu gặp vấn đề với hệ thống đa ngôn ngữ, vui lòng:
1. Kiểm tra file này trước
2. Xem lại ví dụ trong code
3. Liên hệ team development

---

**Phát triển bởi**: ThinkFlow Team  
**Phiên bản**: 1.0.0  
**Cập nhật lần cuối**: November 2025
