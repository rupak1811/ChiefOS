# ChiefOS Design System

Quick reference for maintaining the liquid-glass iOS-inspired aesthetic.

## 🎨 Color Palette

### Primary Colors
```css
--background: #0a0e1a;        /* Deep navy/charcoal */
--foreground: #f0f4f8;        /* Cool white */
--accent-teal: #14b8a6;       /* Primary accent */
--accent-blue: #3b82f6;       /* Secondary accent */
```

### Glass Layers
```css
--glass-light: rgba(255, 255, 255, 0.1);
--glass-medium: rgba(255, 255, 255, 0.15);
--glass-dark: rgba(0, 0, 0, 0.3);
```

### Semantic Colors
```css
--success: #10b981;           /* Green */
--warning: #f59e0b;           /* Yellow/orange */
--error: #ef4444;             /* Red */
--info: #3b82f6;              /* Blue */
```

## 🌊 Glass Morphism Effects

### Standard Glass Card
```css
.glass-morphism {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}
```

### Light Glass Variant
```css
.glass-morphism-light {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
}
```

### Specular Highlights
```css
/* Add shimmer effect to cards */
.card-shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: shimmer 3s infinite;
}
```

## 📐 Spacing Scale

```
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  16px  (1rem)
lg:  24px  (1.5rem)
xl:  32px  (2rem)
2xl: 48px  (3rem)
3xl: 64px  (4rem)
```

## 🔤 Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;
```

### Scale
```
text-xs:   0.75rem  (12px)
text-sm:   0.875rem (14px)
text-base: 1rem     (16px)
text-lg:   1.125rem (18px)
text-xl:   1.25rem  (20px)
text-2xl:  1.5rem   (24px)
text-3xl:  1.875rem (30px)
text-4xl:  2.25rem  (36px)
text-5xl:  3rem     (48px)
text-6xl:  3.75rem  (60px)
text-7xl:  4.5rem   (72px)
```

### Font Weights
```
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
```

## ✨ Animation Presets

### Float Animation
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
```

### Slide In
```css
@keyframes slideIn {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-slide-in {
  animation: slideIn 0.6s ease-out;
}
```

### Fade In
```css
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}
```

### Framer Motion Spring
```typescript
const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

// Hover scale
whileHover={{ scale: 1.02, y: -8 }}

// Entrance
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

## 🎯 Component Patterns

### Gradient Button
```tsx
<button className="px-8 py-4 bg-gradient-to-r from-accent-teal to-accent-blue text-white rounded-xl hover:shadow-lg hover:shadow-accent-teal/50 transition-all">
  Get Started
</button>
```

### Status Badge
```tsx
{/* Active */}
<span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
  Active
</span>

{/* Pending */}
<span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs">
  Pending
</span>

{/* Error */}
<span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs">
  Failed
</span>
```

### Code/Scope Tag
```tsx
<span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono">
  code:write
</span>
```

### Floating Background Orbs
```tsx
<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-teal/20 rounded-full blur-3xl animate-float" />
<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
```

## 📱 Responsive Breakpoints

```css
sm:  640px   /* Small devices */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large screens */
```

### Mobile-First Approach
```tsx
<div className="
  px-4           /* Mobile: 16px padding */
  sm:px-6        /* Tablet: 24px */
  lg:px-8        /* Desktop: 32px */
">
```

## 🎨 Gradient Recipes

### Primary Accent
```css
background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%);
```

### Text Gradient
```css
background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

### Agent Icons
```css
/* Lead - Blue to Cyan */
background: linear-gradient(to bottom right, #3b82f6, #06b6d4);

/* Memory - Cyan to Teal */
background: linear-gradient(to bottom right, #06b6d4, #14b8a6);

/* Code - Teal to Green */
background: linear-gradient(to bottom right, #14b8a6, #10b981);

/* Guardian - Purple to Pink */
background: linear-gradient(to bottom right, #a855f7, #ec4899);
```

## 🔲 Border Radius Scale

```
rounded-sm:   0.125rem (2px)
rounded:      0.25rem  (4px)
rounded-md:   0.375rem (6px)
rounded-lg:   0.5rem   (8px)
rounded-xl:   0.75rem  (12px)
rounded-2xl:  1rem     (16px)
rounded-3xl:  1.5rem   (24px)
rounded-full: 9999px
```

### Standard Uses
- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-xl` (12px)
- Badges: `rounded-lg` (8px)
- Avatars: `rounded-full`

## 🌓 Opacity Scale

```css
.opacity-0:   0%     /* Invisible */
.opacity-5:   5%     /* Very subtle */
.opacity-10:  10%    /* Glass overlays */
.opacity-20:  20%    /* Status badges */
.opacity-40:  40%
.opacity-50:  50%    /* Disabled states */
.opacity-60:  60%    /* Secondary text */
.opacity-70:  70%    /* Body text */
.opacity-80:  80%
.opacity-100: 100%   /* Full opacity */
```

## 🎭 Shadow System

```css
/* Small elevation */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

/* Medium elevation */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Large elevation */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Accent glow (for CTAs) */
.shadow-accent-teal/50 {
  box-shadow: 0 10px 30px rgba(20, 184, 166, 0.5);
}
```

## 🎯 Icon System

Using Lucide React icons throughout:

```tsx
import { 
  Brain,        // Lead agent
  Database,     // Memory agent
  Code2,        // Code agent
  Shield,       // Guardian agent
  Sparkles,     // Features
  CheckCircle,  // Success
  AlertTriangle,// Warning
  Power,        // Kill switch
} from "lucide-react";
```

Standard icon sizes:
- Small: `w-4 h-4` (16px)
- Medium: `w-5 h-5` (20px)
- Large: `w-6 h-6` (24px)
- XL: `w-8 h-8` (32px)

## 🚦 Status Colors

```tsx
{/* Success/Active */}
className="bg-green-500/20 text-green-400"

{/* Warning/Pending */}
className="bg-yellow-500/20 text-yellow-400"

{/* Error/Disabled */}
className="bg-red-500/20 text-red-400"

{/* Info/Processing */}
className="bg-blue-500/20 text-blue-400"

{/* Neutral/Default */}
className="bg-gray-500/20 text-gray-400"
```

## ✅ Design Checklist

When creating new components, ensure:

- [ ] Glass morphism effect applied
- [ ] Proper backdrop blur (16-24px)
- [ ] 1px white/10% border
- [ ] Rounded corners (usually xl or 2xl)
- [ ] Smooth transitions (duration-200 to duration-300)
- [ ] Hover states defined
- [ ] Mobile responsive
- [ ] Accessible contrast ratios
- [ ] Framer Motion for page entrances
- [ ] Consistent spacing from scale

## 🎨 Quick Copy-Paste Snippets

### Glass Card with Hover
```tsx
<div className="glass-morphism-light rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-102 hover:-translate-y-2">
  {/* Content */}
</div>
```

### Gradient CTA
```tsx
<button className="px-8 py-4 bg-gradient-to-r from-accent-teal to-accent-blue text-white font-medium rounded-xl hover:shadow-lg hover:shadow-accent-teal/50 transition-all duration-200">
  Get Started
</button>
```

### Input Field
```tsx
<input className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all" />
```

---

**Maintain this aesthetic across all new components for a cohesive, premium experience.**
