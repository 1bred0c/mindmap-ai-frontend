# 🚀 Quick Start - Language System

## Bắt đầu nhanh trong 3 bước

### 1️⃣ Khởi động server
```bash
npm run dev
```

### 2️⃣ Mở trình duyệt
```
http://localhost:3000
```

### 3️⃣ Thử chuyển đổi ngôn ngữ
Tìm nút 🌐 ở góc phải, click và chọn:
- 🇬🇧 **English**
- 🇻🇳 **Tiếng Việt**

---

## 🎯 Xem Demo

### Demo Page
```
http://localhost:3000/language-demo
```

### Các trang đã có đa ngôn ngữ:
- ✅ `/` - Home Page
- ✅ `/auth/login` - Login
- ✅ `/auth/signup` - Signup  
- ✅ `/dashboard` - Dashboard
- ✅ `/mindmaps/*` - Mind Map Editor
- ✅ `/pricing` - Pricing

---

## 💻 Sử dụng trong Code

```tsx
import { useLanguage } from '@/contexts/language-context';

function MyComponent() {
  const { t } = useLanguage();
  
  return <h1>{t('home.title')}</h1>;
}
```

---

## 📝 Thêm bản dịch mới

### Bước 1: Thêm vào `locales/en.json`
```json
{
  "myPage": {
    "title": "My Title"
  }
}
```

### Bước 2: Thêm vào `locales/vi.json`
```json
{
  "myPage": {
    "title": "Tiêu đề của tôi"
  }
}
```

### Bước 3: Sử dụng
```tsx
{t('myPage.title')}
```

---

## 🎨 Thêm Language Toggle vào page mới

```tsx
import { LanguageToggle } from '@/components/language-toggle';

export default function MyPage() {
  return (
    <div>
      <nav>
        <LanguageToggle />
      </nav>
      {/* content */}
    </div>
  );
}
```

---

## ✅ Checklist triển khai

- [x] Context & Provider
- [x] Language Toggle Component
- [x] Translation files (en.json, vi.json)
- [x] Integration vào layouts
- [x] Home page translations
- [x] Auth pages translations
- [x] Dashboard translations
- [x] Mind Map Editor translations
- [x] Pricing page translations
- [x] Toast notifications
- [x] Documentation
- [x] Demo page

**Status**: ✅ **100% Complete**

---

## 📚 Tài liệu đầy đủ

- [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) - Hướng dẫn chi tiết
- [LANGUAGE_SYSTEM_COMPLETE.md](./LANGUAGE_SYSTEM_COMPLETE.md) - Báo cáo đầy đủ
- [docs/LANGUAGE_DEMO.md](./docs/LANGUAGE_DEMO.md) - Demo guide

---

**Ready to use! 🎉**
