# RTI Remake - Decision Log

This file tracks every technical, UX, and product decision made during the project.
It is maintained throughout development. All decisions that affect user experience, architecture, or scope are logged here with rationale.

---

## D-001 — Framework - Next.js 14+ (App Router)

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** Use Next.js (latest) with the App Router and TypeScript.  
**Rationale:**
- SSR improves page load performance - critical for low-bandwidth Indian mobile users
- File-based routing maps cleanly to the wizard flow
- next-intl integrates natively with App Router for multi-language support
- Large ecosystem, easy deployment to Vercel

---

## D-002 — Styling - Tailwind CSS v4 + shadcn/ui patterns

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** Tailwind CSS v4 as the utility layer, following shadcn/ui patterns for accessible components.  
**Rationale:**
- Components are accessible by default (ARIA labels, keyboard nav)
- Tailwind v4 uses @import and CSS custom properties - lighter config
- Both are industry-standard in the React ecosystem

---

## D-003 — Languages - EN + HI + BN + TA

**Date:** 2026-08-23  
**Status:** ✅ User-Approved  
**Decision:** Support 4 languages: English, Hindi, Bengali, Tamil.  
**Rationale:** User confirmed. Covers the largest RTI-filing demographics in India beyond English.  
**Implementation:** react-i18next with /messages/[locale].json files.

---

## D-004 — Analytics - PostHog

**Date:** 2026-08-23  
**Status:** ✅ User-Approved  
**Decision:** Use PostHog for event tracking and session analytics.  
**Events tracked:** wizard_started, wizard_step_completed, draft_generated, draft_copied, routing_result_viewed, reply_analyzed, appeal_generated, language_switched, tracking_viewed, case_opened.

---

## D-005 — Auth - Clerk.dev

**Date:** 2026-08-23  
**Status:** ✅ User-Approved  
**Decision:** Use Clerk.dev for lightweight authentication.  
**Rationale:** Pre-built sign-in/sign-up UI, Google/email support, free tier. Allows save + resume. Anonymous browsing still allowed.

---

## D-006 — State Routing Coverage - 6 Confirmed States

**Date:** 2026-08-23  
**Status:** ✅ User-Approved  
**States:**
1. Central Government - rtionline.gov.in
2. Uttar Pradesh - rtionline.up.gov.in
3. Kerala - rtiportal.kerala.gov.in
4. Himachal Pradesh - onlinerti.hp.gov.in
5. Rajasthan - rti.rajasthan.gov.in
6. Jammu & Kashmir - rtionline.jk.gov.in

Other states: "Contact your state RTI helpline" fallback + postal filing instructions.

---

## D-007 — AI Draft Simulation - Realistic Mock Responses

**Date:** 2026-08-23  
**Status:** ✅ User-Approved  
**Decision:** Simulate AI-sharpened drafts using pre-written realistic mock responses.  
**Categories:** Ration card, road/infrastructure, pension, education/scholarship, land records, generic.

---

## D-008 — Visual Style - Light / Minimal

**Date:** 2026-08-23  
**Status:** ✅ User-Approved  
**Decision:** White background (#FFFFFF), surface (#F8FAF9), sage green accent (#16A34A), neutral gray typography.  
**Rationale:** User chose "light colours on white bg". Maximizes readability for non-tech users.

---

## D-009 — UX Pattern - Step-by-Step Wizard

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** Multi-step wizard (one action per screen) for RTI filing flow.  
**Steps:** 1. Personal details → 2. Describe problem → 3. Select state → 4. View draft → 5. Confirmation  
**Rationale:** Reduces cognitive load. Single-question flows dramatically improve completion rates.

---

## D-010 — Mobile-First Layout

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** Design for 375px mobile first, scale up for desktop.  
**Rationale:** Most Indian RTI filers access via mobile. Current portals are desktop-only.

---

## D-011 — State Management - Zustand

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** Zustand with persist middleware for wizard state.  
**Rationale:** < 1KB, no boilerplate, works without Context prop-drilling. Persists across page refreshes via localStorage.

---

## D-012 — Reply Scoring Logic - Keyword Pattern Matching

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** Score government replies using regex pattern matching for evasive vs. substantive signals.  
**Weak signals:** "visit office", "not available", "under process", "confidential", "no records", jurisdiction deflection.  
**Strong signals:** certified copies, reference numbers, statutory citations, specific decisions.  
**Rationale:** No LLM needed for demo. Accurately catches the most common RTI reply failure patterns documented in pain points research.

---

## D-013 — Removed Clerk Authentication

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** Removed Clerk. Hardcoded credentials (admin@rti / admin123) for the consumer demo.  
**Rationale:** Simpler one-flow demo experience, no external auth dependencies.

---

## D-014 — Linear Onboarding Flow

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** After login → Location selection → Know Your Rights card → Dashboard.  
**Rationale:** Aligns with minimal feel and non-tech user requirements. Educates before action.

---

## D-015 — Migrated from Next.js to Vite + React SPA

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** Replaced Next.js App Router with Vite + React SPA. next-intl → react-i18next. All client-side.  
**Rationale:** User requested stability. Pure SPA removes SSR complexity for demo purposes.

---

## D-016 — Document Locker & Boot Sequence

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** Added DigiLocker mock integration + 8-second branded boot sequence.  
**Rationale:** User requested for showcase. Simulates identity verification gate before filing.

---

## D-017 — 4 Feature Additions: Print PDF, Hindi Translation, Common Templates, BPL Exemption

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Rationale:** Enhances non-tech user experience. BPL exemption (S.7(5)) is legally significant.

---

## D-018 — Wizard Step 4: "Submit RTI" Button (Consumer Demo Intent)

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** Step 4 shows a "Submit RTI" button that advances to step 5. This is intentional mock behaviour for the consumer demo — actual portal submission is out of scope.  
**Rationale:** This is a consumer-facing demo of the full RTI remake. Mock flows simulate the complete experience without requiring live government API integration.

---

## D-019 — Wizard Step 5: Auto-Reset on Return

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** If a user navigates back to /file when currentStep === 5, the wizard automatically resets to Step 1.  
**Rationale:** Prevents users from getting stuck on the completion screen across sessions.

---

## D-020 — Draft Crash Recovery Banner on Home Page

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** If the user has an in-progress draft (currentStep between 2–4), a prominent recovery banner is shown on the home page with "Continue Draft" and "Start Fresh" options.  
**Rationale:** RTI filing is a multi-step process. Crashes mid-flow are a real pain point. Banner uses Zustand-persisted state to detect interrupted drafts.

---

## D-021 — Global Page Transition Loader: Vertical Timeline Animation

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** Replaced the generic spinner with a branded 4-step vertical timeline: Citizen Filing → Document Scanning → RTI Filed → Got Reply.  
**Duration:** 2.5 seconds minimum (locked). If simulated server load exceeds 2.5s, loader holds until ready.  
**Rationale:** Aesthetic polish for the consumer demo. Makes page transitions feel intentional and on-brand.

---

## D-022 — Check Reply: WhatsApp-Style Chat UI (Government Green Theme)

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** Replaced the textarea input in check-reply with a chat bubble UI showing the citizen's RTI request (green bubble) and the PIO's official reply (white bubble). Analyze button is embedded inside the reply bubble.  
**Styling:** Uses the app's primary green (#16A34A) to match home page branding. Dark green header, scrollable chat area with custom green scrollbar.  
**Layout:** Centered, mobile-width (max-w-[380px]), fixed height with scrollable chat area.  
**Rationale:** Increases engagement and readability. Citizens are familiar with chat UIs. Embeds the analyze CTA contextually inside the reply itself.

---

## D-023 — Language Selector: Centered Top Bar (Global) + Home Page Inline

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** Global LanguageSwitcher fixed at top-center on all pages except home. Home page has its own inline language selector below the area selector (in Row 2 alongside the Alerts button). Dropdown aligns to center.  
**Rationale:** Consistent language access everywhere. Home page inline selector is more contextual next to other settings controls.

---

## D-024 — Home Page Controls Layout: Stacked Rows

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** Home page controls are arranged in two rows:  
- Row 1: Area Selector (centered)  
- Row 2: Language Selector (left) + Alerts On/Off (right), centered as a group  
**Rationale:** Previously all controls were in a single flex-wrap row which looked disorganised. Stacked rows create a cleaner visual hierarchy.

---

## D-025 — Track Detail Page: /track/:id Route

**Date:** 2026-08-23  
**Status:** ✅ Approved  
**Decision:** Created `track-detail.tsx` page at `/track/:id` showing full application details: subject, authority, status badge, filed date, deadline, problem summary, and action buttons (Analyze Reply / Download PDF).  
**Rationale:** "View Details" button on Track page was navigating to /home because the route didn't exist. Now resolves correctly.

---

## D-026 — Consumer Demo Scope: All Mock Flows Are Intentional

**Date:** 2026-08-23  
**Status:** ✅ Confirmed  
**Decision:** This app is a consumer-facing demo of the full RTI remake vision. All mock flows (DigiLocker sync, portal submission, OTP verification, tracking data, reply analysis) are intentional placeholders that simulate the real experience.  
**What is demo/mock (by design):**
- Login credentials (admin@rti / admin123)
- DigiLocker sync (2-second animation)
- OTP verification
- Portal submission (copy-paste to rtionline.gov.in)
- Tracking applications (4 seeded mock RTIs)
- Reply analysis (regex-based, no live API)
- Draft translations (stubs for non-English)
- Stats and ratings data
**What is production-ready logic:**
- RTI draft templates (legally accurate, S.6/7 citations)
- BPL fee exemption flow (S.7(5))
- RTI validity warning (keyword detection)
- Reply quality scoring (7 weak signals, 5 strong signals)
- First Appeal auto-generation (S.19(1) legally correct)
- State routing with real portal URLs and fees
- Zustand persist across sessions
- PostHog analytics event taxonomy

---

## Pending Decisions

| # | Topic | Status |
|---|---|---|
| P-001 | Deployment target (Vercel vs. self-host) | ⏳ Awaiting user input |
| P-002 | Custom domain | ⏳ Awaiting user input |
| P-003 | PostHog API key setup | ⏳ User needs to create PostHog project |
| P-004 | Real AI draft generation (OpenAI API) | ⏳ Future scope |
| P-005 | All 36 states/UTs coverage | ⏳ Future scope |
| P-006 | Real DigiLocker OAuth 2.0 | ⏳ Future scope |
| P-007 | First Appeal filing wizard | ⏳ Next sprint |
| P-008 | Second Appeal / CIC guide | ⏳ Next sprint |
