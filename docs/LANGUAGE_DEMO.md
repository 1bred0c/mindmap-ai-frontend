# 🌐 Language System Demo

## Quick Test

Để test hệ thống ngôn ngữ, hãy:

1. **Khởi động dev server**:
```bash
npm run dev
```

2. **Mở trình duyệt và truy cập**:
```
http://localhost:3000
```

3. **Tìm nút chuyển đổi ngôn ngữ** 🇬🇧/🇻🇳 ở góc phải navigation bar

4. **Click vào nút và chọn ngôn ngữ**:
   - 🇬🇧 English
   - 🇻🇳 Tiếng Việt

5. **Quan sát các thay đổi**:
   - ✅ Tất cả text trên trang sẽ đổi ngay lập tức
   - ✅ Lựa chọn được lưu vào localStorage
   - ✅ Reload trang vẫn giữ nguyên ngôn ngữ đã chọn

## Test Cases

### ✅ Trang chủ (Home Page)
- [ ] Tiêu đề chính
- [ ] Mô tả
- [ ] Các nút CTA
- [ ] Features section
- [ ] Navigation buttons

### ✅ Dashboard
- [ ] Welcome message
- [ ] Stats labels
- [ ] Quick actions
- [ ] Recent workspaces

### ✅ Mind Map Editor
- [ ] Toolbar buttons
- [ ] Dialog titles
- [ ] Toast notifications
- [ ] Loading messages

### ✅ Auth Pages
- [ ] Login form labels
- [ ] Signup form labels
- [ ] Button text
- [ ] Error messages

## Screenshots

### English Version
![English UI](docs/screenshots/en-ui.png)

### Vietnamese Version
![Vietnamese UI](docs/screenshots/vi-ui.png)

## Technical Details

- **Framework**: Next.js 13+ with App Router
- **State Management**: React Context API
- **Storage**: localStorage
- **File Format**: JSON
- **Bundle Size Impact**: ~5KB (translations)
- **Performance**: Zero performance impact

## Keyboard Shortcuts

Không có keyboard shortcuts hiện tại, nhưng có thể thêm:
```tsx
// Future enhancement
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'l') {
      // Toggle language
      setLanguage(language === 'en' ? 'vi' : 'en');
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [language]);
```

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## Known Issues

Không có lỗi nghiêm trọng. Một số điểm cần lưu ý:

1. **Interpolation**: Hiện tại chưa hỗ trợ biến động trong text. Cần sử dụng template strings:
```tsx
// ❌ Không hỗ trợ
t('welcome.message', { name: 'John' })

// ✅ Nên dùng
`${t('welcome.hello')} ${userName}!`
```

2. **Pluralization**: Chưa hỗ trợ số nhiều tự động
3. **Date/Number formatting**: Cần format thủ công

## Future Enhancements

- [ ] Add more languages
- [ ] Implement i18n library (react-i18next)
- [ ] Add pluralization support
- [ ] Add date/time localization
- [ ] Add currency formatting
- [ ] Add language detection from browser
- [ ] Add translation management UI
