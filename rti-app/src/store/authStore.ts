// Hardcoded auth store — no Clerk, no external auth
// Decision D-005 (revised): Simple hardcoded credentials for demo
// admin@rti / admin123

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Hardcoded credentials ────────────────────────────────────────────────────
const VALID_CREDENTIALS = [
  { email: "admin@rti", password: "admin123", name: "Admin" },
];

export interface AuthState {
  isLoggedIn: boolean;
  userEmail: string | null;
  userName: string | null;

  // Onboarding flags (first-time only)
  hasSelectedLocation: boolean;
  hasSeenRights: boolean;

  // Selected state (from onboarding)
  selectedStateId: string;

  // Actions
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  completeLocationStep: (stateId: string) => void;
  completeRightsStep: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      userEmail: null,
      userName: null,
      hasSelectedLocation: false,
      hasSeenRights: false,
      selectedStateId: "",

      login: (email, password) => {
        const match = VALID_CREDENTIALS.find(
          (c) => c.email === email.trim().toLowerCase() && c.password === password
        );
        if (!match) {
          return { success: false, error: "Invalid email or password." };
        }
        set({ isLoggedIn: true, userEmail: match.email, userName: match.name });
        return { success: true };
      },

      logout: () =>
        set({
          isLoggedIn: false,
          userEmail: null,
          userName: null,
          // preserve onboarding flags so next login skips them
        }),

      completeLocationStep: (stateId) =>
        set({ hasSelectedLocation: true, selectedStateId: stateId }),

      completeRightsStep: () => set({ hasSeenRights: true }),
    }),
    {
      name: "rti-auth",
    }
  )
);

// ─── Route helper — determines where to redirect after login ──────────────────
export function getPostLoginRoute(state: AuthState): string {
  if (!state.hasSelectedLocation) return `/onboarding/location`;
  if (!state.hasSeenRights) return `/onboarding/rights`;
  return `/home`;
}
