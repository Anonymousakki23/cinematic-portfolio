# Cinematic Portfolio

A modern, sci-fi themed personal portfolio website built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, and **shadcn/ui** components. Features animated SVG path-drawn text, photography gallery with lightbox, resume timeline, and interactive UI elements.

![Portfolio Preview](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### Core Pages
- **Home** — Animated SVG path-drawn name animation with gradient glow effects
- **About** — Professional profile, services, language proficiency bars, testimonials
- **Resume** — Interactive timeline with experience (4 roles) and education (2 degrees)
- **Photography** — Gallery with category filters (Landscape, Portrait, Food, Architecture, Nature) and full-screen lightbox
- **Contact** — Contact form with mailto integration, contact details, social links
- **Blog** — Article grid with search/filter capabilities

### Design & UX
- **Sci-Fi Dark Theme** — Deep black background (`#050510`) with cyan/magenta/purple accents
- **Custom Font Stack** — Orbitron (display), Exo 2 (body), Share Tech Mono (code)
- **Animated Hero** — SVG text path-drawing animation with gradient strokes
- **Glassmorphism Cards** — Translucent cards with backdrop blur and glow borders
- **Smooth Transitions** — Framer Motion page transitions and micro-interactions
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Reduced Motion Support** — Respects `prefers-reduced-motion`

### Technical Highlights
- **Static Export Ready** — Configured for GitHub Pages / Vercel / Netlify deployment
- **shadcn/ui Components** — Accessible, customizable component library (Button, Card, Dialog, Sheet, Tabs, etc.)
- **Lucide Icons** — Consistent icon system
- **TypeScript Strict Mode** — Full type safety
- **ESLint + Prettier** — Code quality enforcement

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm / pnpm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Anonymousakki23/cinematic-portfolio.git
cd cinematic-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler check |

## 📁 Project Structure

```
cinematic-portfolio/
├── public/                      # Static assets
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── about/page.tsx       # About page
│   │   ├── blog/page.tsx        # Blog page
│   │   ├── contact/page.tsx     # Contact page
│   │   ├── photography/page.tsx # Photography gallery
│   │   ├── resume/page.tsx      # Resume timeline
│   │   ├── layout.tsx           # Root layout + metadata
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles + Tailwind
│   ├── components/
│   │   └── ui/                  # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── path-drawing-portfolio-hero.tsx # Animated hero
│   │       ├── progress.tsx
│   │       ├── sheet.tsx
│   │       ├── skeleton.tsx
│   │       ├── tabs.tsx
│   │       ├── table.tsx
│   │       ├── textarea.tsx
│   │       ├── badge.tsx
│   │       └── icons.ts         # Lucide icon exports
│   └── lib/
│       └── utils.ts             # cn() utility for class merging
├── .gitignore
├── next.config.mjs              # Next.js configuration
├── package.json
├── postcss.config.js            # Tailwind v4 PostCSS
├── tailwind.config.ts           # Tailwind theme config
└── tsconfig.json                # TypeScript config
```

## 🎨 Customization

### Colors (Tailwind Config)
Edit `tailwind.config.ts` to customize the sci-fi color palette:

```ts
colors: {
  'quantum-cyan': '#00FFFF',
  'interference-purple': '#7B61FF',
  'deep-black': '#050510',
  'neon-magenta': '#FF00FF',
  'amber-gold': '#FFDB70',
  // ... more colors
}
```

### Fonts
Fonts are loaded via `next/font/google` in `src/app/layout.tsx`:
- **Orbitron** — Display headings
- **Exo 2** — Body text
- **Share Tech Mono** — Monospace/code

### Content
Update page content by editing the respective files in `src/app/*/page.tsx`:
- Profile info, services, languages → `src/app/about/page.tsx`
- Experience/Education timeline → `src/app/resume/page.tsx`
- Photography images/categories → `src/app/photography/page.tsx`
- Contact form details → `src/app/contact/page.tsx`
- Blog posts → `src/app/blog/page.tsx`

### Hero Animation
The path-drawing hero is in `src/components/ui/path-drawing-portfolio-hero.tsx`:
```tsx
<PathDrawingPortfolioHero
  brand="Your Name"
  tagline="Your Title"
  eyebrow="Portfolio"
  fromColor="#00FFFF"
  toColor="#7B61FF"
/>
```

## 📦 Deployment

### Static Export (GitHub Pages / Netlify / Vercel)

The project is configured for static export in `next.config.mjs`:

```js
output: 'export',
images: { unoptimized: true },
```

```bash
npm run build
# Output in ./out directory
```

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy — zero config needed

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

## 🧩 shadcn/ui Components

This project uses a custom shadcn/ui implementation. Components are in `src/components/ui/`:

| Component | Description |
|-----------|-------------|
| `Button` | Multiple variants (default, outline, ghost, link) |
| `Card` | Flexible card layout (Header, Content, Footer) |
| `Dialog` | Accessible modal dialogs |
| `Sheet` | Slide-in side panels |
| `Tabs` | Tabbed navigation |
| `Input` / `Textarea` | Form inputs |
| `Label` | Accessible form labels |
| `Progress` | Progress bars |
| `Badge` | Status indicators |
| `Skeleton` | Loading placeholders |
| `Table` | Data tables |

## 📝 License

MIT License — feel free to use this for your own portfolio.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) — Component patterns
- [Lucide Icons](https://lucide.dev/) — Icon set
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [Next.js](https://nextjs.org/) — React framework

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
