# 🌌 Cosmic Mindmap Theme System

## Overview
A dark, tech-inspired design system for the MindMap Pro application, featuring neural network aesthetics with neon accents and cosmic vibes inspired by Supabase's modern dashboard design.

## 🎨 Design Philosophy

### Core Concept
**"Navigate the Universe of Connected Intelligence"**

The theme creates an immersive experience where users feel like they're exploring a neural network or cosmic space where ideas connect through light and energy.

### Emotional Goals
- 🧠 **Intelligence**: Professional and sophisticated
- 🌟 **Wonder**: Inspiring "wow" moments with subtle animations
- 🤝 **Friendly**: Approachable and welcoming
- ⚡ **Tech**: Modern and cutting-edge

## 🎭 Color Palette

### Base Colors
```css
Background: #0a0a0f → #111827 → #1a1a2e (gradient)
Card: #15151f (with 50% opacity + backdrop blur)
Text: #f2f2f2 (95% white)
```

### Neon Accents
```css
Primary Purple: #8b5cf6 (262° 83% 58%)
Accent Cyan:    #00ffff (180° 100% 50%)
Accent Green:   #00ffb3 (160° 84% 39%)
Accent Pink:    #ff00ff (300° 100% 50%)
```

### Utility Colors
```css
Muted:   hsl(240, 8%, 20%)
Border:  hsl(240, 10%, 18%)
Success: Emerald/Green
Warning: Amber
Error:   Red
```

## 📝 Typography

### Font Families
- **Sans/Body**: Inter (primary)
- **Display/Headings**: Manrope
- **Code/Mono**: Space Grotesk

### Usage
```tsx
<h1 className="font-display">Main Heading</h1>
<p className="font-sans">Body text</p>
<code className="font-mono">Code snippets</code>
```

## 🎨 Component Styles

### Glass Cards
```tsx
// Automatic with Card component
<Card>Content</Card>

// Manual glass effect
<div className="glass-card">Content</div>
<div className="glass-card-hover">Hoverable card</div>
```

### Neon Borders
```tsx
<div className="neon-border-cyan">Cyan glow</div>
<div className="neon-border-purple">Purple glow</div>
<div className="neon-border-green">Green glow</div>
```

### Text Glow
```tsx
<h2 className="text-glow-purple">Glowing Purple Text</h2>
<span className="text-glow-cyan">Glowing Cyan Text</span>
```

### Neural Nodes
```tsx
import { NeuralNode } from '@/components/neural-node';

<NeuralNode glowColor="cyan" size="md">
  Node content
</NeuralNode>
```

## 🎬 Animations

### Built-in Animations
```tsx
// Pulse glow effect
<div className="animate-pulse-glow">Pulsing</div>

// Float animation
<div className="animate-float">Floating</div>

// Shimmer effect
<div className="animate-shimmer">Shimmering</div>

// Neural pulse
<div className="animate-neural-pulse">Neural pulse</div>
```

### Custom Animations
All animations are defined in `tailwind.config.ts` and can be customized.

## 🌐 Background Effects

### Cosmic Background
```tsx
import { CosmicBackground } from '@/components/cosmic-background';

function Layout() {
  return (
    <>
      <CosmicBackground />
      <main>Content</main>
    </>
  );
}
```

### Particle Effect
```tsx
import { ParticleEffect } from '@/components/cosmic-background';

<ParticleEffect />
```

## 🎯 Common Patterns

### Hero Section
```tsx
<div className="text-center space-y-8">
  <h1 className="text-6xl font-bold font-display">
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">
      Gradient Text
    </span>
  </h1>
</div>
```

### Stats Card
```tsx
<Card className="group relative overflow-hidden">
  <CardHeader>
    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
      <Icon className="h-4 w-4 text-cyan-400" />
    </div>
    <CardTitle>Stat Title</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
      Value
    </div>
  </CardContent>
</Card>
```

### Button with Icon
```tsx
<Button className="group">
  <Icon className="mr-2 group-hover:rotate-12 transition-transform" />
  Action
</Button>
```

## 🎨 Utility Classes

### Depth & Layering
```tsx
<div className="depth-layer">3D depth effect</div>
<div className="cosmic-grid">Grid background</div>
```

### Custom Scrollbar
```tsx
<div className="custom-scrollbar overflow-auto">
  Scrollable content
</div>
```

### Node Effects
```tsx
<div className="node-glow">
  Hover for glow effect
</div>
```

## 📱 Responsive Design

All components are mobile-first and responsive:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Content */}
</div>
```

## ⚡ Performance Tips

1. **Backdrop Blur**: Use sparingly, can be expensive on low-end devices
2. **Animations**: Keep subtle and purposeful
3. **Shadows**: Multiple box-shadows can impact performance
4. **Gradients**: Use CSS gradients over images when possible

## 🎯 Best Practices

### DO ✅
- Use glassmorphism for cards and panels
- Add subtle hover animations (scale, glow)
- Use gradient text for emphasis
- Layer depth with blur and opacity
- Keep animations smooth (300ms duration)

### DON'T ❌
- Overuse neon colors (use as accents only)
- Make animations too fast or jarring
- Use pure white (#fff) - use off-white (#f2f2f2)
- Stack too many glass effects
- Forget hover states on interactive elements

## 🔧 Customization

### Changing Primary Color
Edit `tailwind.config.ts`:
```ts
colors: {
  neon: {
    purple: '#your-color',
  }
}
```

### Adding New Animation
```ts
keyframes: {
  'your-animation': {
    '0%': { /* start */ },
    '100%': { /* end */ }
  }
},
animation: {
  'your-animation': 'your-animation 3s ease-in-out infinite'
}
```

## 📦 Component Library

### Available Components
- `Card` - Glass morphism card
- `Button` - Neon glow button
- `Input` - Glass input with focus glow
- `NeuralNode` - Mindmap node component
- `CosmicBackground` - Animated background
- `ParticleEffect` - Floating particles

## 🎨 Theme Toggle

The app defaults to dark mode. To add light mode support, update:
```tsx
// layout.tsx
<html className="dark"> // Remove to allow toggle
```

## 📚 Resources

- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev
- Framer Motion (optional): https://www.framer.com/motion

---

**Created with ❤️ for MindMap Pro**  
*"Where ideas connect through light and energy"* ✨
