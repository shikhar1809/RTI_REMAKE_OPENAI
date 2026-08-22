# RTI Remake — Decision Log

This file tracks every technical, UX, and product decision made during the project.
It is maintained throughout development. All decisions that affect user experience, architecture, or scope are logged here with rationale.

---

## D-001 · Framework — Next.js 14+ (App Router)

**Date:** 2026-08-23  
**Status:** ? Approved  
**Decision:** Use Next.js (latest) with the App Router and TypeScript.  
**Rationale:**
- SSR improves page load performance — critical for low-bandwidth Indian mobile users
- File-based routing maps cleanly to the wizard flow
- next-intl integrates natively with App Router for multi-language support
- Large ecosystem, easy deployment to Vercel

---

## D-002 · Styling — Tailwind CSS v4 + shadcn/ui patterns

**Date:** 2026-08-23  
**Status:** ? Approved  
**Decision:** Tailwind CSS v4 as the utility layer, following shadcn/ui patterns for accessible components.  
**Rationale:**
- Components are accessible by default (ARIA labels, keyboard nav)
- Tailwind v4 uses @import and CSS custom properties — lighter config
- Both are industry-standard in the React ecosystem

---

## D-003 · Languages — EN + HI + BN + TA

**Date:** 2026-08-23  
**Status:** ? User-Approved  
**Decision:** Support 4 languages: English, Hindi, Bengali, Tamil.  
**Rationale:** User confirmed. Covers the largest RTI-filing demographics in India beyond English.  
**Implementation:** next-intl with /messages/[locale].json files. Locale prefix in URL: /en, /hi, /bn, /ta.

---

## D-004 · Analytics — PostHog

**Date:** 2026-08-23  
**Status:** ? User-Approved  
**Decision:** Use PostHog for event tracking and session analytics.  
**Events tracked:** wizard_started, wizard_step_completed, draft_generated, draft_copied, routing_result_viewed, reply_analyzed, appeal_generated, language_switched, tracking_viewed, case_opened.

---

## D-005 · Auth — Clerk.dev

**Date:** 2026-08-23  
**Status:** ? User-Approved  
**Decision:** Use Clerk.dev for lightweight authentication.  
**Rationale:** Pre-built sign-in/sign-up UI, Google/email support, free tier. Allows save + resume. Anonymous browsing still allowed.

---

## D-006 · State Routing Coverage — 6 Confirmed States

**Date:** 2026-08-23  
**Status:** ? User-Approved  
**States:**
1. Central Government — rtionline.gov.in
2. Uttar Pradesh — rtionline.up.gov.in
3. Kerala — rtiportal.kerala.gov.in
4. Himachal Pradesh — onlinerti.hp.gov.in
5. Rajasthan — rti.rajasthan.gov.in
6. Jammu & Kashmir — rtionline.jk.gov.in

Other states: "Contact your state RTI helpline" fallback + postal filing instructions.

---

## D-007 · AI Draft Simulation — Realistic Mock Responses

**Date:** 2026-08-23  
**Status:** ? User-Approved  
**Decision:** Simulate AI-sharpened drafts using pre-written realistic mock responses.  
**Categories:** Ration card, road/infrastructure, pension, education/scholarship, land records, generic.

---

## D-008 · Visual Style — Light / Minimal

**Date:** 2026-08-23  
**Status:** ? User-Approved  
**Decision:** White background (#FFFFFF), surface (#F8FAF9), sage green accent (#16A34A), neutral gray typography.  
**Rationale:** User chose "light colours on white bg". Maximizes readability for non-tech users.

---

## D-009 · UX Pattern — Step-by-Step Wizard

**Date:** 2026-08-23  
**Status:** ? Approved  
**Decision:** Multi-step wizard (one action per screen) for RTI filing flow.  
**Steps:** 1. Describe problem ? 2. Select state ? 3. View generated draft  
**Rationale:** Reduces cognitive load. Single-question flows dramatically improve completion rates.

---

## D-010 · Mobile-First Layout

**Date:** 2026-08-23  
**Status:** ? Approved  
**Decision:** Design for 375px mobile first, scale up for desktop.  
**Rationale:** Most Indian RTI filers access via mobile. Current portals are desktop-only.

---

## D-011 · State Management — Zustand

**Date:** 2026-08-23  
**Status:** ? Approved  
**Decision:** Zustand with persist middleware for wizard state.  
**Rationale:** < 1KB, no boilerplate, works with App Router without Context prop-drilling. Persists across page refreshes.

---

## D-012 · Reply Scoring Logic — Keyword Pattern Matching

**Date:** 2026-08-23  
**Status:** ? Approved  
**Decision:** Score government replies using regex pattern matching for evasive vs. substantive signals.  
**Weak signals:** "visit office", "not available", "under process", "confidential", "no records", jurisdiction deflection.  
**Strong signals:** certified copies, reference numbers, statutory citations, specific decisions.  
**Rationale:** No LLM needed for demo. Accurately catches the most common RTI reply failure patterns documented in the pain points research.

---

## Pending Decisions

| # | Topic | Status |
|---|---|---|
| P-001 | Deployment target (Vercel vs. self-host) | ? Awaiting user input |
| P-002 | Custom domain | ? Awaiting user input |
| P-003 | PostHog API key setup | ? User needs to create PostHog project |
| P-004 | Clerk.dev publishable key setup | ? User needs Clerk account |

D-013: Removed Clerk Authentication completely.
Rationale: The user requested a simple, seamless one-flow experience without external dependencies. A hardcoded set of credentials (admin@rti / admin123) is used for the demo.

D-014: Added linear onboarding flow.
Rationale: After login, users are guided through Location selection and a Know Your Rights education card before they reach the main dashboard. This aligns with the 'minimal feel' and 'non-tech people' requirements, ensuring they are educated before taking action.


D-015: Migrated from Next.js to Vite + React.
Rationale: The user requested to completely remove Next.js and replace it with a standard React SPA due to stability issues. Replaced App Router with react-router-dom, next-intl with react-i18next, and removed all Server Components. The app is now a purely client-side SPA.


D-016: Added Document Locker & Boot Sequence.
Rationale: User requested a DigiLocker mock integration for checking documents, and an initial 8-second boot sequence screen (simulating component loading and prerequisite checking) for the showcase.

