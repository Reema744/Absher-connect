# Absher Smart Suggestions - Dummy App

## Overview

This is a dummy Absher mobile/web application that demonstrates a "Smart Suggestions" feature for a government services portal. The app displays personalized suggestion cards in a horizontal carousel at the top of the homepage, simulating how Saudi Arabia's Absher platform could recommend relevant services to users based on their documents, appointments, violations, and eligibility status.

The application uses a mock data engine to generate contextual suggestions such as passport renewal reminders, traffic violation payment deadlines, appointment notifications, and Hajj registration eligibility alerts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript running on Vite for fast development and optimized production builds.

**UI Component Library**: shadcn/ui components built on Radix UI primitives, providing accessible and customizable UI elements with Tailwind CSS styling.

**Routing**: Wouter for lightweight client-side routing.

**State Management**: TanStack Query (React Query) for server state management, with queries configured for infinite stale time and disabled refetching to work with static mock data.

**Design System**: Material Design adapted for government services with a green primary color scheme (HSL: 150 65% 35%), following mobile-first responsive principles. The design prioritizes trust, clarity, accessibility (WCAG 2.1 AA), and efficiency.

**Key UI Patterns**:
- Horizontal scrolling carousel with auto-slide functionality (5-second intervals)
- Card-based layouts with consistent spacing (Tailwind units: 2, 4, 6, 8)
- Touch-optimized interface with minimum 48px (h-12) touch targets
- Fixed header navigation and bottom mobile navigation

### Backend Architecture

**Server Framework**: Express.js on Node.js with TypeScript.

**API Design**: RESTful JSON API with two primary endpoints:
- `GET /api/suggestions/:userId` - Returns personalized suggestions array
- `GET /api/users/:userId` - Returns user profile data

**Suggestion Engine**: Server-side business logic (`server/suggestions.ts`) that analyzes user data against configuration thresholds to generate prioritized suggestions:
- Document expiry checking (passport, national ID, driving license)
- Traffic violation discount deadlines
- Appointment reminders
- Delegation expiry tracking
- Service eligibility (Hajj registration)

**Data Source**: Static JSON files in the `data/` directory serve as mock databases:
- `users.json` - User profiles with document dates, violations, appointments
- `config.json` - Configurable thresholds for suggestion triggers

**Type Safety**: Shared TypeScript schemas using Zod for runtime validation across client and server (`shared/schema.ts`).

### Build & Deployment

**Development**: Vite dev server with HMR (Hot Module Replacement) proxied through Express for API integration.

**Production Build**: 
- Client: Vite builds optimized static assets to `dist/public`
- Server: esbuild bundles server code to `dist/index.cjs` with selective dependency bundling for faster cold starts

**Static File Serving**: Express serves built client assets and falls back to `index.html` for SPA routing.

## External Dependencies

### UI Component Libraries
- **Radix UI**: Headless component primitives (accordion, dialog, dropdown, popover, select, tabs, toast, tooltip, etc.)
- **shadcn/ui**: Pre-styled components built on Radix with customizable Tailwind variants
- **Lucide React**: Icon library for consistent iconography

### Styling & Design
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **class-variance-authority**: Type-safe component variant management
- **clsx & tailwind-merge**: Conditional className composition

### Data & State Management
- **TanStack Query v5**: Async state management for API data fetching
- **Zod**: Schema validation and TypeScript type inference
- **drizzle-zod**: Integration between Drizzle ORM schemas and Zod validators

### Carousel & Interactions
- **Embla Carousel React**: Touch-friendly carousel with auto-play capabilities

### Database (Configured but not actively used)
- **Drizzle ORM**: Type-safe PostgreSQL ORM configured for future database integration
- **@neondatabase/serverless**: Neon serverless Postgres driver
- **connect-pg-simple**: PostgreSQL session store for Express (configured for future use)

### Routing & Forms
- **Wouter**: Lightweight React router (~1KB)
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Validation resolver integration for React Hook Form

### Development Tools
- **TypeScript**: Static type checking across the entire codebase
- **Vite**: Build tool with optimized dev server
- **esbuild**: Fast JavaScript bundler for server code
- **Replit plugins**: Runtime error overlay, cartographer, dev banner for Replit development environment

### Utilities
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **cmdk**: Command menu component (included but not currently used)

**Note**: The application is configured with Drizzle ORM and PostgreSQL connection settings (`drizzle.config.ts`, `DATABASE_URL` environment variable), but currently operates entirely on mock JSON data. Database integration can be added later by implementing the storage interface defined in `server/storage.ts`.