# Absher Smart Suggestions - Dummy App

## Overview

This is a dummy Absher mobile/web application that demonstrates a "Smart Suggestions" feature for a government services portal. The app displays personalized suggestion cards in a horizontal carousel at the top of the homepage, simulating how Saudi Arabia's Absher platform could recommend relevant services to users based on their documents, appointments, violations, and eligibility status.

The application uses a database-driven suggestion engine to generate contextual suggestions such as passport renewal reminders, traffic violation payment deadlines, appointment notifications, and Hajj registration eligibility alerts.

## User Preferences

Preferred communication style: Simple, everyday language.

## Authentication

- **Login**: Users authenticate with their User ID (1-100) and password (same as User ID for demo purposes)
- **Session Management**: Express session with memory store
- **Protected Routes**: All API endpoints (except auth) require authentication

Demo credentials: Use any user ID from 1-100 with password matching the ID (e.g., user 1, password 1)

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript running on Vite for fast development and optimized production builds.

**UI Component Library**: shadcn/ui components built on Radix UI primitives, providing accessible and customizable UI elements with Tailwind CSS styling.

**Routing**: Wouter for lightweight client-side routing with protected routes:
- `/login` - Login page (public)
- `/` - Home page with suggestions carousel (protected)
- `/services/:type/:id?` - Service detail pages (protected)

**State Management**: TanStack Query (React Query) for server state management with authentication context.

**Design System**: Material Design adapted for government services with a green primary color scheme (HSL: 150 65% 35%), following mobile-first responsive principles. The design prioritizes trust, clarity, accessibility (WCAG 2.1 AA), and efficiency.

**Key UI Patterns**:
- Horizontal scrolling carousel with auto-slide functionality (5-second intervals)
- Card-based layouts with consistent spacing (Tailwind units: 2, 4, 6, 8)
- Touch-optimized interface with minimum 48px (h-12) touch targets
- Fixed header navigation and bottom mobile navigation
- Service detail pages with "Start Service" action button

### Backend Architecture

**Server Framework**: Express.js on Node.js with TypeScript.

**Database**: PostgreSQL with Drizzle ORM
- `users` - 100 users with ID, national ID, password, name, email, phone
- `passports` - Passport records with expiry dates
- `national_ids` - National ID records with expiry dates
- `driving_licenses` - Driving license records with expiry dates
- `violations` - Traffic violations with discount expiry
- `appointments` - Scheduled appointments
- `delegations` - Delegation authorities with expiry
- `hajj_status` - Hajj eligibility and registration status

**API Design**: RESTful JSON API with authentication:

Auth endpoints:
- `POST /api/auth/login` - Login with userId and password
- `POST /api/auth/logout` - Logout and clear session
- `GET /api/auth/me` - Get current user

Protected endpoints:
- `GET /api/suggestions/:userId` - Returns personalized suggestions array
- `GET /api/users/:userId` - Returns user profile data
- `GET /api/services/passport/:userId` - Passport details
- `GET /api/services/national-id/:userId` - National ID details
- `GET /api/services/driving-license/:userId` - Driving license details
- `GET /api/services/violations/:userId` - List of violations
- `GET /api/services/violations/:userId/:violationId` - Single violation
- `GET /api/services/appointments/:userId` - List of appointments
- `GET /api/services/appointments/:userId/:appointmentId` - Single appointment
- `GET /api/services/delegations/:userId` - List of delegations
- `GET /api/services/delegations/:userId/:delegationId` - Single delegation
- `GET /api/services/hajj/:userId` - Hajj status

**Suggestion Engine**: Server-side business logic (`server/suggestions.ts`) that analyzes user data against configuration thresholds to generate prioritized suggestions:
- Document expiry checking (passport, national ID, driving license) - 30 day threshold
- Traffic violation discount deadlines - 72 hour threshold
- Appointment reminders - 24 hour threshold
- Delegation expiry tracking - 7 day threshold
- Service eligibility (Hajj registration)

**Type Safety**: Shared TypeScript schemas using Zod for runtime validation across client and server (`shared/schema.ts`).

### Build & Deployment

**Development**: Vite dev server with HMR (Hot Module Replacement) proxied through Express for API integration.

**Database Setup**:
- Schema defined in `shared/schema.ts` using Drizzle ORM
- Push schema changes with `npm run db:push`
- Seed database with `npx tsx server/seed.ts`

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

### Database
- **Drizzle ORM**: Type-safe PostgreSQL ORM
- **@neondatabase/serverless**: Neon serverless Postgres driver
- **express-session**: Session management for authentication
- **memorystore**: In-memory session store

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

## Key Files

- `shared/schema.ts` - Database schema and type definitions
- `server/db.ts` - Database connection
- `server/storage.ts` - Data access layer (DatabaseStorage)
- `server/routes.ts` - API routes with authentication
- `server/suggestions.ts` - Suggestion generation logic
- `server/seed.ts` - Database seeding script
- `client/src/hooks/use-auth.tsx` - Authentication context and hooks
- `client/src/pages/Login.tsx` - Login page
- `client/src/pages/Home.tsx` - Main dashboard
- `client/src/pages/ServiceDetail.tsx` - Service detail pages
- `data/config.json` - Suggestion engine configuration thresholds
