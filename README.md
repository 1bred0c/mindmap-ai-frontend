# 🌌 ThinkFlow - Cosmic Theme Edition

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-13.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-cyan?style=for-the-badge&logo=tailwindcss)

**Navigate the Universe of Connected Intelligence** ✨

*A modern, dark-themed mind mapping application with neural network aesthetics*

[Demo](#) · [Documentation](./docs/THEME_SYSTEM.md) · [Quick Start](./QUICK_START.md)

</div>

---

## 🎨 Theme Highlights

### **Cosmic Dark Dashboard**
Inspired by Supabase's modern design system, featuring:
- 🌟 **Glass Morphism** - Translucent cards with backdrop blur
- ✨ **Neon Accents** - Cyan, Purple, and Green glow effects
- 🎬 **Smooth Animations** - Subtle hover states and transitions
- 🌌 **Neural Network Aesthetics** - Connected nodes with flowing energy
- 🎯 **Professional Yet Friendly** - Clean, accessible, and wow-worthy

---

## 🚀 Features

### 🎨 **Visual Design**
- Dark theme with cosmic gradient backgrounds
- Glass morphism cards and panels
- Neon glow effects on hover
- Animated neural network lines
- Floating particle effects
- Circuit board patterns

### 🧩 **Components**
- **NeuralNode** - Glowing mindmap nodes
- **CosmicBackground** - Animated space effects
- **CosmicLoader** - Beautiful loading states
- **Glass Cards** - Translucent panels
- **Gradient Text** - Animated color flows

### 📱 **Responsive**
- Mobile-first design
- Touch-friendly interactions
- Adaptive layouts
- Optimized for all screen sizes

### ⚡ **Performance**
- CSS-based animations (GPU accelerated)
- Optimized backdrop blur
- Reduced motion support
- Lightweight and fast

---

## 📦 Tech Stack

- **Framework**: Next.js 13.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Fonts**: Inter, Manrope, Space Grotesk
- **Authentication**: JWT + Google OAuth
- **Backend**: Spring Boot (API)

---

## 🎯 Quick Start

### 1. **Clone & Install**
```bash
git clone https://github.com/bctDaGithub/mindmap-ai-frontend.git
cd mindmap-ai-frontend
npm install
```

### 2. **Run Development Server**
```bash
npm run dev
```

### 3. **Open Browser**
Visit `http://localhost:3000` to see the cosmic magic! ✨

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [THEME_SYSTEM.md](./docs/THEME_SYSTEM.md) | Complete theme documentation |
| [QUICK_START.md](./QUICK_START.md) | 5-minute getting started guide |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) | How to apply theme to new pages |
| [COSMIC_THEME_SUMMARY.md](./COSMIC_THEME_SUMMARY.md) | Full implementation summary |

---

## 🎨 Color Palette

### **Base Colors**
```
Background:  #0a0a0f → #111827 → #1a1a2e
Card:        #15151f (50% opacity + backdrop blur)
Text:        #f2f2f2 (95% white)
```

### **Neon Accents**
```
Purple:  #8b5cf6  HSL(262° 83% 58%)
Cyan:    #00ffff  HSL(180° 100% 50%)
Green:   #00ffb3  HSL(160° 84% 39%)
Pink:    #ff00ff  HSL(300° 100% 50%)
```

---

## 🧩 Component Examples

### **Glass Card**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Beautiful Card</CardTitle>
  </CardHeader>
  <CardContent>
    Automatic glass effect with neon glow!
  </CardContent>
</Card>
```

### **Neural Node**
```tsx
<NeuralNode glowColor="cyan" size="md">
  <h3>Your Idea</h3>
  <p>Connected through light</p>
</NeuralNode>
```

### **Gradient Text**
```tsx
<h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
  Amazing Title
</h1>
```

---

## 📸 Screenshots

### **Homepage**
<div align="center">
<img src="https://via.placeholder.com/800x400/0a0a0f/8b5cf6?text=Cosmic+Homepage" alt="Homepage" />
<p><i>Landing page with neural network aesthetics</i></p>
</div>

### **Dashboard**
<div align="center">
<img src="https://via.placeholder.com/800x400/0a0a0f/00ffff?text=Dashboard+Stats" alt="Dashboard" />
<p><i>Stats dashboard with glass morphism cards</i></p>
</div>

### **Mind Maps**
<div align="center">
<img src="https://via.placeholder.com/800x400/0a0a0f/00ffb3?text=Neural+Mind+Maps" alt="Mind Maps" />
<p><i>Mind map visualization with glowing nodes</i></p>
</div>

---

## 🗂️ Project Structure

```
mindmap-ai-frontend/
├── app/                          # Next.js pages
│   ├── globals.css              # Core theme CSS
│   ├── cosmic-effects.css       # Advanced effects
│   ├── layout.tsx               # Root layout with fonts
│   ├── page.tsx                 # Homepage ✨
│   ├── dashboard/               # Dashboard ✨
│   ├── auth/                    # Auth pages ✨
│   ├── mindmaps/                # Mindmap pages ✨
│   ├── workspaces/              # Workspace pages
│   └── theme-showcase/          # Component demo ✨
│
├── components/
│   ├── cosmic-background.tsx    # Background effects ✨
│   ├── neural-node.tsx          # Node components ✨
│   ├── cosmic-loader.tsx        # Loading states ✨
│   ├── layout/
│   │   └── dashboard-layout.tsx
│   └── ui/                      # Shadcn components
│       ├── button.tsx           # ✨ Updated
│       ├── card.tsx             # ✨ Updated
│       └── input.tsx            # ✨ Updated
│
├── docs/
│   ├── THEME_SYSTEM.md          # Documentation
│   └── INTEGRATION_GUIDE.md
│
├── tailwind.config.ts           # ✨ Updated
└── README.md                    # This file

✨ = Updated with Cosmic Theme
```

---

## 🎯 Pages Status

| Page | Status | Theme Applied |
|------|--------|---------------|
| Homepage | ✅ | Fully themed |
| Dashboard | ✅ | Fully themed |
| Login | ✅ | Fully themed |
| Signup | ✅ | Fully themed |
| Mind Maps List | ✅ | Fully themed |
| Mind Map Detail | 🔄 | Partially |
| Workspaces | 🔄 | Partially |
| Profile | ⏳ | Pending |
| Settings | ⏳ | Pending |
| Pricing | ⏳ | Pending |
| Theme Showcase | ✅ | Demo page |

---

## 🛠️ Development

### **Available Scripts**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### **Environment Variables**
```env
NEXT_PUBLIC_API_ENDPOINT=http://localhost:8080/api/v1
```

---

## 🎨 Customization

### **Change Primary Color**
Edit `tailwind.config.ts`:
```ts
colors: {
  neon: {
    purple: '#your-color',
  }
}
```

### **Add New Animation**
Edit `tailwind.config.ts`:
```ts
keyframes: {
  'your-animation': {
    '0%': { /* start */ },
    '100%': { /* end */ }
  }
}
```

### **Create Custom Effect**
Add to `app/cosmic-effects.css`:
```css
.your-effect {
  /* Custom CSS */
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Design Inspiration**: Supabase Dashboard
- **UI Components**: shadcn/ui
- **Icons**: Lucide Icons
- **Fonts**: Google Fonts (Inter, Manrope)

---

## 📧 Contact

- **GitHub**: [@bctDaGithub](https://github.com/bctDaGithub)
- **Repository**: [mindmap-ai-frontend](https://github.com/bctDaGithub/mindmap-ai-frontend)

---

<div align="center">

**Built with ❤️ for the neural universe of ideas**

*"Where thoughts connect through light and energy"* ✨

[⬆ Back to Top](#-mindmap-pro---cosmic-theme-edition)

</div>
