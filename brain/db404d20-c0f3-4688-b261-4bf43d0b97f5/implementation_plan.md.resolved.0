# Project Status & Brainstorming Session

## Current Project Status
Based on a review of the recent conversation history and codebase, here is where we are at with Spectral Soundworks:
- **Completed Agents**: Tier 1, 2, and 3 agents are fully implemented, providing robust automation for data enrichment, lead scoring, contact discovery, duplicate detection, and genre standardization.
- **Recent Frontend Work**: The Leads Dashboard has been heavily updated for responsive design, adding premium aesthetics with cinematic banners and dynamic styling.
- **Crawlers**: Event crawlers (Empire, Mohawk) have been developed and refined to filter out "bunk" (irrelevant) events.

## Existing Issues to Resolve
I have identified a few existing issues that should be addressed:

1. **Sidebar Active State Navigation**: Currently, the `<Sidebar>` component hardcodes the `active` state for the Home icon. It does not update based on the current route.
2. **Non-Functional Search Bar**: The top search bar in `<Navbar>` is purely visual. It currently has no state, form, or routing attached to it to allow searching through artists/leads.
3. **Overly Aggressive Event Filtering**: In `isBunkEvent` (`src/lib/utils.ts`), terms like "Album Release" and "Anniversary" are marked as bunk. While generic events are bad, an "Album Release" or "Anniversary" show for a real artist is a highly valuable event. We should refine this logic.
4. **Missing npm Scripts Support**: The `npm run lint` script fails locally because `eslint` might not be globally linked or properly resolved on this environment without `npx`. We can add better script compatibility or run tests directly via npx.

## Brainstorming New Functions & Agents

Since you have completed your Tier 1-3 agents, here are some **Tier 4** ideas to take Spectral Soundworks to the next level:

### 1. Automated Outreach Draft Generation (AI Agent)
- **Concept**: An agent that reads an artist's latest release, Instagram bio, and genre to automatically generate highly contextualized and personalized email outreach drafts.
- **Why**: Saves significant manual effort and ensures every cold email feels bespoke and tailored.

### 2. Smart Venue Analytics
- **Concept**: Since you crawl venues like Mohawk and Empire, we can score *venues* based on the aggregate quality score of the artists who play there.
- **Why**: Helps prioritize which venues to actively monitor. If Mohawk consistently books higher-scoring artists, you can allocate more API usage/crawling frequency there.

### 3. Global Command Palette / Search
- **Concept**: Implement the `Navbar` search to be a command palette (like `Cmd+K` / `Ctrl+K`) that allows you to instantly search leads by name, genre, or location, and jump straight to their details page.
- **Why**: Crucial for quick navigation as the database grows.

### 4. Smart Inbox & Reply Detection
- **Concept**: An agent that scans an IMAP inbox for replies from leads and automatically updates their status from `FOLLOW_UP` to `RESPONDED` or `NEGOTIATING`.
- **Why**: Closes the loop on the outreach lifecycle so you don't have to manually update lead statuses when they reply.

---

## User Review Required

> [!IMPORTANT]
> Please review the issues and new feature ideas above.
> 
> **How would you like to proceed?**
> 1. Should I go ahead and fix the existing issues (Sidebar, Navbar, Event Filtering)?
> 2. Which of the brainstormed ideas (1-4) would you like to implement next? Or do you have another direction in mind?
