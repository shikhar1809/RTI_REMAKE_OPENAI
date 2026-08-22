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

  // Notifications
  notificationsEnabled: boolean;
  contactVerified: boolean;
  whatsappNumber: string | null;
  notificationEmail: string | null;

  // Saved Profile for RTIs
  savedFullName: string;
  savedAddress: string;
  savedMobile: string;

  // Actions
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  completeLocationStep: (stateId: string) => void;
  completeRightsStep: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  verifyContact: (wa: string, email: string) => void;
  saveProfileDetails: (name: string, address: string, mobile: string) => void;
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
      
      notificationsEnabled: false,
      contactVerified: false,
      whatsappNumber: null,
      notificationEmail: null,
      
      savedFullName: "",
      savedAddress: "",
      savedMobile: "",

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
      
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      
      verifyContact: (wa, email) => 
        set({ contactVerified: true, whatsappNumber: wa, notificationEmail: email, notificationsEnabled: true }),
        
      saveProfileDetails: (name, address, mobile) =>
        set({ savedFullName: name, savedAddress: address, savedMobile: mobile }),
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
