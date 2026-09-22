# ChiefOS Content & Asset Guide

This document maps where to place hero assets, copy, and design tokens so your team can quickly drop in production content without touching code.

## 📁 Asset Directories

### Hero Images & Carousel

**Location**: `public/images/hero/`

Current carousel uses Unsplash URLs. Replace with your own images:

```
public/images/hero/
├── slide-1.jpg     # AI Agent Interface (1200x800px recommended)
├── slide-2.jpg     # Modern Dashboard
└── slide-3.jpg     # Automation Workflow
```

**Update in**: `components/ImageCarousel.tsx` (lines 8-22)

```typescript
const images = [
  { url: "/images/hero/slide-1.jpg", alt: "AI Agent Interface" },
  { url: "/images/hero/slide-2.jpg", alt: "Modern Dashboard" },
  { url: "/images/hero/slide-3.jpg", alt: "Automation Workflow" },
];
```

### Work/Portfolio Images

**Location**: `public/images/work/`

```
public/images/work/
├── project-1.jpg   # Enterprise Automation Platform (800x600px)
├── project-2.jpg   # Smart Customer Support
├── project-3.jpg   # Code Review Assistant
└── project-4.jpg   # Research Data Pipeline
```

**Update in**: `app/(marketing)/work/page.tsx` (lines 5-31)

### Team/About Images

**Location**: `public/images/team/`

```
public/images/team/
├── team-photo.jpg
└── office.jpg
```

### Logo & Branding

**Location**: `public/images/brand/`

```
public/images/brand/
├── logo.svg        # Primary logo
├── logo-white.svg  # White version for dark backgrounds
├── favicon.ico     # 32x32px
└── og-image.jpg    # 1200x630px for social sharing
```

**Update in**: 
- `components/Navigation.tsx` (line 34-39)
- `components/Footer.tsx` (line 7-12)
- `app/layout.tsx` (metadata)

## 🎨 Design Tokens

### Current Color Palette

**Location**: `tailwind.config.ts` (lines 10-21)

```typescript
colors: {
  background: "var(--background)",     // #0a0e1a (dark)
  foreground: "var(--foreground)",     // #f0f4f8 (light)
  glass: {
    light: "rgba(255, 255, 255, 0.1)",
    medium: "rgba(255, 255, 255, 0.15)",
    dark: "rgba(0, 0, 0, 0.3)",
  },
  accent: {
    teal: "#14b8a6",
    blue: "#3b82f6",
  },
}
```

### Typography

**Location**: `app/globals.css` (line 19)

Current: System font stack (Apple, Segoe, Roboto)

To use custom fonts:
1. Add fonts to `public/fonts/`
2. Import in `app/layout.tsx`
3. Update `font-family` in `globals.css`

### Glass Morphism Styles

**Location**: `app/globals.css` (lines 27-44)

```css
.glass-morphism {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-morphism-light {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
```

Adjust blur, saturation, and opacity values to match your design system.

## ✍️ Copy & Content

### Landing Page

**Location**: `app/(marketing)/page.tsx`

| Section | Lines | Content |
|---------|-------|---------|
| Hero headline | 30-33 | "Your Agents, Under Your Control" |
| Hero subheadline | 34-37 | Value proposition paragraph |
| Why ChiefOS features | 66-104 | Three feature cards |
| Built for Professionals | 113-133 | Feature list with checkmarks |
| CTA section | 162-173 | Final call-to-action |

### Services Page

**Location**: `app/(marketing)/services/page.tsx`

| Section | Lines | Content |
|---------|-------|---------|
| Agent descriptions | 6-57 | Four agent cards with capabilities |
| Enterprise security | 129-153 | Security features section |

### How We Work

**Location**: `app/(marketing)/how-we-work/page.tsx`

| Section | Lines | Content |
|---------|-------|---------|
| Process steps | 5-43 | Five-step workflow (Discover → Ship) |
| Safety features | 91-115 | Security highlights |

### Work/Portfolio

**Location**: `app/(marketing)/work/page.tsx`

| Section | Lines | Content |
|---------|-------|---------|
| Project showcases | 5-31 | Four portfolio items with metrics |

### Contact

**Location**: `app/(marketing)/contact/page.tsx`

| Section | Lines | Content |
|---------|-------|---------|
| Contact methods | 46-78 | Email, support, enterprise info |

### Footer

**Location**: `components/Footer.tsx`

| Section | Lines | Content |
|---------|-------|---------|
| Company description | 17-20 | Brand tagline |
| Navigation links | 25-39 | Product and company links |

## 🔧 Configuration

### Site Metadata

**Location**: `app/layout.tsx` (lines 4-7)

```typescript
export const metadata: Metadata = {
  title: "ChiefOS - Permissioned Multi-Agent Operating System",
  description: "Professional multi-agent OS with liquid-glass design",
};
```

### Contact Email

**Location**: `app/(marketing)/contact/page.tsx` (line 56)

Current: `hello@chiefos.dev`

### Social Links (To Add)

Add social links to footer:

```typescript
// In components/Footer.tsx
const socialLinks = [
  { name: "Twitter", url: "https://twitter.com/chiefos" },
  { name: "LinkedIn", url: "https://linkedin.com/company/chiefos" },
  { name: "GitHub", url: "https://github.com/rupak1811/ChiefOS" },
];
```

## 📊 Analytics & Tracking

### To Add Google Analytics

1. Get tracking ID from Google Analytics
2. Add to `.env`:
   ```env
   NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
   ```
3. Add Script to `app/layout.tsx`:
   ```typescript
   <Script src={`https://www.googletagmantics.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
   ```

### To Add Posthog/Mixpanel

Similar pattern - add script tag in root layout with your project token.

## 🚀 Quick Asset Drop Workflow

1. **Designer exports assets** → Drop into appropriate `public/images/` folder
2. **Copywriter finalizes content** → Update page.tsx files at specified line numbers
3. **Design tokens finalized** → Update `tailwind.config.ts` and `globals.css`
4. **Test locally**: `npm run dev`
5. **Build**: `npm run build`
6. **Deploy**: Push to main or deploy branch

## 📝 Content Placeholders to Replace

High priority items currently using placeholder content:

- [ ] Hero carousel images (currently using Unsplash)
- [ ] Work/portfolio project images (currently using Unsplash)
- [ ] Company email address (currently `hello@chiefos.dev`)
- [ ] Social media links (not yet added)
- [ ] Custom logo (currently using gradient circle with "C")
- [ ] Favicon (currently Next.js default)
- [ ] OG image for social sharing

## 🎯 Brand Voice Guidelines

Current tone: Professional, technical, trustworthy

Key phrases used:
- "Permissioned capabilities"
- "Human oversight"
- "Enterprise-grade security"
- "Liquid-glass design"
- "Append-only ledger"
- "Kill switch"

Maintain this voice when updating copy to ensure consistency.

## 💡 Tips for Content Updates

1. **Keep hero headline under 10 words** for mobile readability
2. **Feature descriptions should be 2-3 sentences max**
3. **Use active voice**: "Agents execute" not "Execution is done by agents"
4. **Emphasize control**: Users are always in charge, not the agents
5. **Technical accuracy**: This is a professional product for technical users

## 🔗 Quick Reference Links

| What | Where | Why |
|------|-------|-----|
| Hero carousel | `components/ImageCarousel.tsx` | Main landing page slider |
| Colors | `tailwind.config.ts` | Design tokens |
| Glass effects | `app/globals.css` | UI styling |
| Marketing copy | `app/(marketing)/*/page.tsx` | All public pages |
| Meta tags | `app/layout.tsx` | SEO and social sharing |
| Logo | `components/Navigation.tsx` & `Footer.tsx` | Branding |

---

**Questions?** Open an issue or check the main README.md for architecture details.
