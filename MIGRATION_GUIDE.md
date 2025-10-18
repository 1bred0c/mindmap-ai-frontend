# 🔄 Migration Guide - Applying Cosmic Theme to Remaining Pages

## Overview
Hướng dẫn chi tiết để áp dụng Cosmic Theme cho các trang còn lại trong ứng dụng.

---

## 📋 Checklist - Pages To Update

- ✅ `app/page.tsx` - Homepage (DONE)
- ✅ `app/dashboard/page.tsx` - Dashboard (DONE)
- ⬜ `app/auth/login/page.tsx` - Login page
- ⬜ `app/auth/signup/page.tsx` - Signup page
- ⬜ `app/auth/forgot-password/page.tsx` - Forgot password
- ⬜ `app/mindmaps/page.tsx` - Mindmaps list
- ⬜ `app/mindmaps/[id]/page.tsx` - Mindmap detail
- ⬜ `app/mindmaps/new/page.tsx` - New mindmap
- ⬜ `app/workspaces/page.tsx` - Workspaces list
- ⬜ `app/workspaces/[id]/page.tsx` - Workspace detail
- ⬜ `app/workspaces/new/page.tsx` - New workspace
- ⬜ `app/pricing/page.tsx` - Pricing page
- ⬜ `app/profile/page.tsx` - Profile page
- ⬜ `app/settings/page.tsx` - Settings page
- ⬜ `app/ai/page.tsx` - AI page

---

## 🎨 Standard Pattern - Auth Pages

### Template for Login/Signup Pages

```tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CosmicBackground } from '@/components/cosmic-background';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <CosmicBackground />
      
      {/* Decorative orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" />
      
      <div className="relative z-10 w-full max-w-md px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-display">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Welcome Back
              </span>
            </CardTitle>
            <CardDescription>
              Sign in to access your neural universe
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form className="space-y-4">
              <div>
                <Input 
                  type="email" 
                  placeholder="Email address" 
                />
              </div>
              <div>
                <Input 
                  type="password" 
                  placeholder="Password" 
                />
              </div>
              <Button className="w-full" type="submit">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## 🎯 Standard Pattern - List Pages

### Template for Mindmaps/Workspaces List

```tsx
'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Brain } from 'lucide-react';
import Link from 'next/link';

export default function ListPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-display">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Your Mindmaps
              </span>
            </h1>
            <p className="text-gray-400 mt-2">
              Explore your connected ideas
            </p>
          </div>
          <Button asChild className="group">
            <Link href="/mindmaps/new">
              <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
              New Mindmap
            </Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="group hover-lift">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Brain className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild className="w-full">
                  <Link href={`/mindmaps/${item.id}`}>
                    Open →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
```

---

## 🎨 Standard Pattern - Detail Pages

### Template for Mindmap/Workspace Detail

```tsx
'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NeuralNode, NodeCluster } from '@/components/neural-node';
import { Edit, Share2, Trash } from 'lucide-react';

export default function DetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-display">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Mindmap Title
              </span>
            </h1>
            <p className="text-gray-400 mt-2">Created on {date}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Content Area with Neural Nodes */}
        <NodeCluster title="Main Branches">
          <div className="space-y-4">
            <NeuralNode glowColor="cyan" size="md">
              <h3 className="font-semibold text-white mb-1">Central Idea</h3>
              <p className="text-sm text-gray-400">Description...</p>
            </NeuralNode>
            
            <div className="ml-8 space-y-4">
              <NeuralNode glowColor="purple" size="sm">
                <p className="text-sm text-white">Sub-idea 1</p>
              </NeuralNode>
              <NeuralNode glowColor="green" size="sm">
                <p className="text-sm text-white">Sub-idea 2</p>
              </NeuralNode>
            </div>
          </div>
        </NodeCluster>
      </div>
    </DashboardLayout>
  );
}
```

---

## 🎯 Standard Pattern - Form Pages

### Template for New/Edit Forms

```tsx
'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';

export default function FormPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold font-display">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Create New Mindmap
              </span>
            </h1>
            <p className="text-gray-400 mt-2">
              Start your journey in the neural universe
            </p>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Title
                  </label>
                  <Input placeholder="My Amazing Mindmap" />
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Description
                  </label>
                  <Input placeholder="What is this about?" />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    Create Mindmap
                  </Button>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
```

---

## 🎯 Standard Pattern - Pricing Page

```tsx
'use client';

import { CosmicBackground } from '@/components/cosmic-background';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Zap } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: ['5 Mindmaps', 'Basic Features', 'Community Support'],
      color: 'cyan',
    },
    {
      name: 'Pro',
      price: '$9',
      features: ['Unlimited Mindmaps', 'AI Features', 'Priority Support'],
      color: 'purple',
      featured: true,
    },
    {
      name: 'Team',
      price: '$29',
      features: ['Everything in Pro', 'Team Collaboration', 'Advanced Analytics'],
      color: 'green',
    },
  ];

  return (
    <div className="min-h-screen relative">
      <CosmicBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-6xl font-bold font-display">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">
              Choose Your Plan
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Unlock the full power of your neural universe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={plan.featured ? 'scale-105 border-purple-500/50' : ''}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-sm font-medium">
                  <Zap className="inline h-3 w-3 mr-1" />
                  Most Popular
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-display">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mt-4">
                  {plan.price}
                  <span className="text-lg text-gray-500">/month</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-emerald-400" />
                      <span className="text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full" variant={plan.featured ? 'default' : 'outline'}>
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ Step-by-Step Migration Process

### For Each Page:

1. **Add Imports**
```tsx
import { CosmicBackground } from '@/components/cosmic-background';
import { NeuralNode } from '@/components/neural-node';
// ... other cosmic components
```

2. **Update Title/Headers**
```tsx
<h1 className="text-4xl font-bold font-display">
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
    Page Title
  </span>
</h1>
```

3. **Replace Cards**
- Remove old card styling
- Use new `Card` component (auto glass effect)
- Add hover effects where appropriate

4. **Update Buttons**
- Add icon animations: `group-hover:scale-110 transition-transform`
- Use proper variants

5. **Add Background (if fullscreen page)**
```tsx
<CosmicBackground />
<div className="relative z-10">
  {/* content */}
</div>
```

6. **Test Responsiveness**
- Check mobile view
- Verify hover states
- Test animations

---

## 🎨 Common Replacements

### Old → New

```tsx
// Old
<div className="bg-white dark:bg-gray-800">

// New
<Card>

// Old
<button className="bg-blue-500">

// New
<Button>

// Old
<h1 className="text-3xl font-bold">

// New
<h1 className="text-4xl font-bold font-display">
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
```

---

## 🎯 Priority Order

1. **High Priority** (User-facing, frequently used):
   - ✅ Login/Signup pages
   - ✅ Dashboard (Done)
   - ✅ Mindmaps list & detail
   - ✅ Workspaces list & detail

2. **Medium Priority**:
   - Pricing page
   - Profile page
   - Settings page

3. **Low Priority**:
   - Admin pages
   - Other utility pages

---

## 📚 Resources

- **Examples**: See `app/page.tsx` and `app/dashboard/page.tsx`
- **Components**: Check `app/theme-showcase/page.tsx`
- **Documentation**: Read `docs/THEME_SYSTEM.md`
- **Quick Start**: See `QUICK_START.md`

---

**Happy migrating! 🚀 Transform one page at a time into the cosmic universe!** ✨
