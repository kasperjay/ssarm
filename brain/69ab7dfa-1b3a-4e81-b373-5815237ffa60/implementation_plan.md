# Responsive Dashboard Layout Refactor

This plan outlines the changes needed to make the Spectral Soundworks dashboard responsive and usable on mobile devices, transitioning from a strictly desktop-oriented UI to a fluid, cross-platform interface.

## User Review Required

> [!IMPORTANT]
> The current fixed side-navigation bar will be converted to a modern **Bottom Navigation Bar** on mobile devices. This is a common and mobile-friendly pattern for web apps.
> The top navigation (search) will remain but will shrink in height and padding on mobile devices to preserve vertical screen space.
> Please review and approve this pattern.

## Proposed Changes

### Global Layout & Navigation

The layout wrapper and persistent navigational elements need responsive classes to adapt based on screen width.

#### [MODIFY] layout.tsx (file:///c:/Users/kp/Documents/spectral-soundworks-app/src/app/layout.tsx)
- Ensure the `<main>` wrapper clears the Sidebar on desktop (`md:ml-24`) and the Bottom Nav on mobile (`pb-24 md:pb-0 ml-0`).

#### [MODIFY] Sidebar.tsx (file:///c:/Users/kp/Documents/spectral-soundworks-app/src/components/Sidebar.tsx)
- Change from a purely left-anchored vertical bar to a responsive orientation:
  - Mobile: Fixed to `bottom-0`, full width, horizontal flex layout (`flex-row`), adding bottom-safe padding, with a semi-transparent backdrop blur.
  - Desktop: `md:w-24`, `md:top-0`, `md:bottom-0`, `flex-col`.
- Adjust "Wave Transition Element" to only show on desktop.
- Re-position profile and footer nav visually to accommodate the mobile bottom bar layout.

#### [MODIFY] Navbar.tsx (file:///c:/Users/kp/Documents/spectral-soundworks-app/src/components/Navbar.tsx)
- Adapt left-margin logic corresponding to Sidebar: `ml-0 md:ml-24`.
- Reduce height and padding on mobile: `h-16 md:h-24`, `px-4 md:px-12`.
- Adjust the layout of the search bar, hiding certain elements (like utility icons) or condensing them on tight mobile screens.

---

### Dashboard Pages

We will update the core tracking interfaces to switch from wide, multi-column grids to robust mobile flex-columns, while scaling fonts appropriately.

#### [MODIFY] page.tsx (Dashboard Home) (file:///c:/Users/kp/Documents/spectral-soundworks-app/src/app/page.tsx)
- Page padding: `px-12 pt-12` -> `px-4 md:px-12 pt-6 md:pt-12`.
- Hero banner: Scale down font (`text-3xl md:text-5xl`), reduce constraints dynamically (`h-[240px] md:h-[320px]`, `rounded-3xl md:rounded-[48px]`), and adjust inner absolute paddings.
- Quick stats cards & leads feed: Ensure parent grids use `grid-cols-1` on mobile, scaling up to multi-column on `lg:` breakpoints. Add `flex-col` adjustments inside card content so labels/status pills don't overflow sideways.

#### [MODIFY] leads/page.tsx (Inbox) (file:///c:/Users/kp/Documents/spectral-soundworks-app/src/app/leads/page.tsx)
- Container padding: Ensure it has left/right padding suitable for mobile (`px-4 md:px-6`).
- Header block: Stack "Total Leads" card and "+ New Search" button vertically on mobile, horizontal on desktop.
- Lead list cards: The internal `flex-wrap` is present, but forced constraints like `w-64` on score progress bars will be changed to `w-full md:w-64` to prevent viewport breaking.
- Adjust padding to accommodate the new mobile bottom nav (`pb-32 md:pb-20`).

## Open Questions

- Should we hide the Search Bar entirely on mobile to save space and put it behind an icon, or just shrink it down? (I will plan to shrink it to fit the bar alongside a user avatar unless specified otherwise).

## Verification Plan

### Manual Verification
- Resize the browser window to test dynamic shifting between breakpoints (`<md`, `md`, `lg`).
- Verify that the bottom nav is accessible on mobile and doesn't collide with page content.
- Ensure no horizontal scrolling (overflow) occurs on `375px` width (iPhone SE size).
