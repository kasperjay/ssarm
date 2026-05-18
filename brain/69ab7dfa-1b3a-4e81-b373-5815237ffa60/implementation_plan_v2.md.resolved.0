# Responsive Layout Completion (Detailed Views)

This plan expands the responsive layout implementation to secondary pages (Discovery, Lead Details, and Projects) to ensure a consistent mobile/tablet experience throughout the application.

## User Review Required

> [!IMPORTANT]
> Some tables and grids (like the Search Results table in Lead Discovery) will implement horizontal scrolling on mobile to preserve data density while preventing layout breaking.
> Header fonts will be dynamically scaled to ensure they don't wrap awkwardly on narrow screens.

## Proposed Changes

### Lead Discovery Page

#### [MODIFY] [leads/discover/page.tsx](file:///c:/Users/kp/Documents/spectral-soundworks-app/src/app/leads/discover/page.tsx)
- **Container Padding**: Adjust outer padding from `px-6` to `px-4 md:px-6`.
- **Hero Typography**: Scale header from `text-3xl` on mobile to `7xl` on large monitors.
- **Card Spacing**: Reduce `p-10!` padding to `p-6` on mobile to regain screen real estate.
- **Grids**: Ensure the "Discovery Limit" button grid uses two columns on mobile instead of four.
- **Table Density**: Reduce cell padding in results tables for better mobile fit.

### Lead Details Page

#### [MODIFY] [leads/[id]/page.tsx](file:///c:/Users/kp/Documents/spectral-soundworks-app/src/app/leads/%5Bid%5D/page.tsx)
- **Cinematic Header**: Adjust fixed height `h-[400px]` -> `h-[280px] md:h-[400px]` and rounding for smaller screens.
- **Layout Grid**: Ensure the main two-column layout stacks properly (already mostly handled, but verification of gaps/paddings is needed).
- **Social Block**: Refactor internal flex containers to use `flex-col` on mobile for better alignment of Bio vs Stats.
- **Feedbacks/Drafts**: Adjust card padding and font sizes for readability.

### Project Management Page

#### [MODIFY] [projects/page.tsx](file:///c:/Users/kp/Documents/spectral-soundworks-app/src/app/projects/page.tsx)
- **Layout**: Scale standard container paddings for mobile.
- **Project Cards**: Swtich from `flex-row` to `flex-col` for card actions (e.g., stats vs titles) when viewed on very narrow screens.
- **Form Overlay**: Ensure the "Create Project" form remains usable and accessible within its GlassCard container on mobile.

## Verification Plan

### Automated Tests
- I will use the `browser_subagent` to verify all three pages at `375px` (iPhone SE), `768px` (iPad), and `1440px` (Desktop) breakpoints.

### Manual Verification
- Resize browser window progressively and observe "break" points.
- Verify that the bottom navigation bar doesn't overlap any critical "Save" or "Submit" buttons.
