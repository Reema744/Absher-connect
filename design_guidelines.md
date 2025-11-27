# Design Guidelines: Absher Smart Suggestions App

## Design Approach
**Selected Approach:** Design System (Material Design adapted for government services)
**Justification:** Utility-focused government portal requiring trust, accessibility, and efficiency. Users need quick access to services with clear information hierarchy.

## Core Design Principles
1. **Trust & Clarity:** Clean layouts, clear typography, government service reliability
2. **Mobile-First:** Optimized for mobile with responsive scaling
3. **Accessibility:** WCAG 2.1 AA compliant, high contrast, clear touch targets
4. **Efficiency:** Minimal taps/clicks to complete actions, scannable information

## Typography
- **Primary Font:** Inter or Roboto via Google Fonts
- **Headers:** Font weight 600-700, sizes: text-2xl (h1), text-xl (h2), text-lg (h3)
- **Body Text:** Font weight 400, text-base (16px) for optimal readability
- **Card Titles:** Font weight 600, text-lg
- **Descriptions:** Font weight 400, text-sm with text-gray-600
- **Action Labels:** Font weight 500, text-sm uppercase tracking-wide

## Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Consistent padding: p-4 for cards, p-6 for containers
- Vertical rhythm: space-y-4 for stacked elements, space-y-6 for sections
- Touch targets: Minimum h-12 for buttons, adequate spacing between interactive elements

**Container Widths:**
- Mobile: Full width with px-4 padding
- Desktop: max-w-6xl centered with mx-auto

## Component Library

### Smart Suggestions Carousel
- **Container:** Full-width horizontal scroll, overflow-x-auto with snap-scroll behavior
- **Card Dimensions:** w-80 (320px) width, h-40 (160px) height, maintains aspect ratio
- **Card Styling:** Rounded corners (rounded-xl), elevated shadow (shadow-lg), white background
- **Card Layout:** Padding p-6, flex column with space-between for title, description, action button alignment
- **Carousel Controls:** Scroll indicators (dots) centered below, auto-slide with 5-second intervals

### Suggestion Cards
- **Structure:** Vertical stack with icon/badge at top, title, description, action button at bottom
- **Icon Area:** h-10 w-10 circular badge with category icon (document, alert, calendar)
- **Title:** text-lg font-semibold, mb-2
- **Description:** text-sm text-gray-600, mb-4, line-clamp-2 for overflow
- **Expiry Badge:** If present, small pill badge (rounded-full px-3 py-1 text-xs) positioned top-right
- **Action Button:** Full-width, h-10, rounded-lg, primary action styling

### Header
- **Layout:** Fixed top, h-16, flex items-center justify-between, px-4
- **Logo/Title:** text-xl font-bold
- **Navigation:** Mobile: Hamburger menu icon, Desktop: Horizontal nav links

### Dashboard Grid (Below Carousel)
- **Layout:** Grid layout, grid-cols-2 gap-4 on mobile, grid-cols-4 gap-6 on desktop
- **Service Cards:** Square aspect ratio, rounded-lg, shadow-md, p-4, centered icon and label
- **Card Content:** Icon (h-12 w-12), label (text-sm font-medium mt-2)

## Interaction Patterns
- **Carousel:** Horizontal swipe on touch, mouse drag on desktop, pause auto-slide on hover/touch
- **Cards:** Subtle hover lift (hover:shadow-xl transition), tap feedback (active:scale-95)
- **Buttons:** Solid background with hover:opacity-90, focus rings for keyboard navigation
- **Touch Targets:** Minimum 44x44px, adequate spacing (gap-4) between elements

## Animations
**Minimal & Purposeful:**
- Carousel auto-slide: Smooth scroll with ease-in-out, 0.5s duration
- Card hover: Subtle transform and shadow transition, 200ms
- Button interactions: Opacity/scale changes, 150ms
- Loading states: Simple spinner or skeleton screens
- **No** elaborate scroll animations or complex motion

## Mobile Optimization
- **Viewport:** No forced 100vh sections, natural content flow
- **Carousel:** Edge-to-edge on mobile (no side padding), snap-scroll for better control
- **Typography:** Slightly smaller base size (text-sm) on mobile, scales to text-base on tablet+
- **Spacing:** Reduced padding on mobile (p-4 vs p-6), maintains readability
- **Touch Zones:** All interactive elements minimum 44x44px with adequate spacing

## Images
**No Hero Images:** This is a utility dashboard, not a marketing page. Focus on functional UI.

**Icon Usage:**
- Use Heroicons via CDN (solid and outline variants)
- Category icons for suggestion types: DocumentIcon, ExclamationTriangleIcon, CalendarIcon, UserGroupIcon
- Navigation and action icons as needed
- Consistent 24x24px sizing for inline icons

## Accessibility
- High contrast text (gray-900 on white, white on primary)
- Focus indicators on all interactive elements
- Semantic HTML throughout
- ARIA labels for carousel navigation and card actions
- Screen reader announcements for auto-slide changes
- Keyboard navigation support (arrow keys for carousel)

## Visual Hierarchy
1. **Carousel (Priority 1):** Prominent position, elevated cards, clear CTAs
2. **Service Grid (Priority 2):** Organized grid below carousel, clear labels
3. **Header (Persistent):** Fixed position, subtle shadow to separate from content
4. **Footer (Low Priority):** Simple links and info, muted styling