# Dubai Property IQ

> A Next.js application for Dubai real estate intelligence and property analysis.

## Overview

Dubai Property IQ provides comprehensive real estate data, analytics, and insights for the Dubai property market. Built with modern web technologies for optimal performance and user experience.

## Tech Stack

| Technology       | Version | Purpose                                  |
| ---------------- | ------- | ---------------------------------------- |
| **Next.js**      | 16.1.6  | React framework with App Router          |
| **React**        | 19.2.3  | UI library                               |
| **TypeScript**   | 5       | Type-safe development                    |
| **Tailwind CSS** | v4      | Styling and design system                |
| **next/font**    | -       | Optimized font loading (Geist Sans/Mono) |

## Project Structure

```
dubaipropertyiq/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── docs/                  # Project documentation
│   └── CODING_STANDARDS.md
├── public/                # Static assets
├── CHANGELOG.md           # Version history
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
# Production build
npm run build

# Start production server
npm run start
```

### Linting

```bash
# Run ESLint
npm run lint
```

### Type Checking

```bash
# TypeScript type check (no emit)
npx tsc --noEmit
```

## Documentation

- [CHANGELOG.md](./CHANGELOG.md) - Version history and changes
- [docs/CODING_STANDARDS.md](./docs/CODING_STANDARDS.md) - Code style and comment standards

## Development Workflow

1. All code changes must include:
   - Descriptive git commit messages
   - Updated documentation where applicable
   - Inline comments for complex logic

2. Before committing:
   ```bash
   npx tsc --noEmit  # Type check
   npm run lint      # ESLint check
   ```

## Contributing

See [docs/CODING_STANDARDS.md](./docs/CODING_STANDARDS.md) for coding guidelines.

## License

[Your License Here]

---

Built with [Next.js](https://nextjs.org) | [Report Issues](../../issues)
