// PostHog Analytics wrapper
// Decision D-004: PostHog for event tracking + session replay
// All events are namespaced with 'rti_' prefix for easy filtering

import posthog from "posthog-js";

export const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY ?? "";
export const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST ?? "https://app.posthog.com";

export function initPostHog() {
  if (typeof window === "undefined" || !POSTHOG_KEY) return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // We manually capture with locale
    persistence: "localStorage",
  });
}

// ─── Event names ───────────────────────────────────────────────────────────────

export const Events = {
  PAGE_VIEW: "rti_page_view",
  WIZARD_STARTED: "rti_wizard_started",
  WIZARD_STEP_COMPLETED: "rti_wizard_step_completed",
  DRAFT_GENERATED: "rti_draft_generated",
  DRAFT_COPIED: "rti_draft_copied",
  DRAFT_DOWNLOADED: "rti_draft_downloaded",
  APPLICATION_SAVED: "rti_application_saved",
  ROUTING_RESULT_VIEWED: "rti_routing_result_viewed",
  REPLY_CHECK_STARTED: "rti_reply_check_started",
  REPLY_ANALYZED: "rti_reply_analyzed",
  APPEAL_GENERATED: "rti_appeal_generated",
  APPEAL_COPIED: "rti_appeal_copied",
  LANGUAGE_SWITCHED: "rti_language_switched",
  TRACKING_VIEWED: "rti_tracking_viewed",
  CASE_OPENED: "rti_case_opened",
} as const;

// ─── Typed event helpers ────────────────────────────────────────────────────────

export function trackPageView(path: string, locale: string) {
  if (typeof window === "undefined") return;
  posthog.capture(Events.PAGE_VIEW, { path, locale });
}

export function trackWizardStarted(locale: string) {
  posthog.capture(Events.WIZARD_STARTED, { locale });
}

export function trackWizardStep(step: number, stateId?: string) {
  posthog.capture(Events.WIZARD_STEP_COMPLETED, { step, stateId });
}

export function trackDraftGenerated(stateId: string, category: string) {
  posthog.capture(Events.DRAFT_GENERATED, { stateId, category });
}

export function trackDraftCopied(stateId: string) {
  posthog.capture(Events.DRAFT_COPIED, { stateId });
}

export function trackReplyAnalyzed(score: number, verdict: "strong" | "weak") {
  posthog.capture(Events.REPLY_ANALYZED, { score, verdict });
}

export function trackAppealGenerated(fromScore: number) {
  posthog.capture(Events.APPEAL_GENERATED, { fromScore });
}

export function trackLanguageSwitched(from: string, to: string) {
  posthog.capture(Events.LANGUAGE_SWITCHED, { from, to });
}
