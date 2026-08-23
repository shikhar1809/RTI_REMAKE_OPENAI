// RTI Wizard global state — Zustand store
// Decision D-011: Zustand for wizard state

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RTIDraft } from "@/data/mockDrafts";
import type { ReplyAnalysis } from "@/data/mockReplies";

export interface RTIWizardState {
  // Step 1: Personal Details
  applicantName: string;
  applicantAddress: string;
  applicantMobile: string;

  // Step 2: Problem description
  problemDescription: string;

  // Step 3: State selection
  selectedStateId: string;

  // Step 4: Generated draft
  draft: RTIDraft | null;

  // Reply checking
  replyText: string;
  replyAnalysis: ReplyAnalysis | null;

  // Wizard current step
  currentStep: number;

  // Actions
  setApplicantName: (name: string) => void;
  setApplicantAddress: (address: string) => void;
  setApplicantMobile: (mobile: string) => void;
  setProblemDescription: (text: string) => void;
  setSelectedStateId: (id: string) => void;
  setDraft: (draft: RTIDraft) => void;
  setReplyText: (text: string) => void;
  setReplyAnalysis: (analysis: ReplyAnalysis) => void;
  setCurrentStep: (step: number) => void;
  resetWizard: () => void;
}

export const useRTIStore = create<RTIWizardState>()(
  persist(
    (set) => ({
      applicantName: "",
      applicantAddress: "",
      applicantMobile: "",
      problemDescription: "",
      selectedStateId: "",
      draft: null,
      replyText: "",
      replyAnalysis: null,
      currentStep: 1,

      setApplicantName: (name) => set({ applicantName: name }),
      setApplicantAddress: (address) => set({ applicantAddress: address }),
      setApplicantMobile: (mobile) => set({ applicantMobile: mobile }),
      setProblemDescription: (text) => set({ problemDescription: text }),
      setSelectedStateId: (id) => set({ selectedStateId: id }),
      setDraft: (draft) => set({ draft }),
      setReplyText: (text) => set({ replyText: text }),
      setReplyAnalysis: (analysis) => set({ replyAnalysis: analysis }),
      setCurrentStep: (step) => set({ currentStep: step }),
      resetWizard: () =>
        set({
          applicantName: "",
          applicantAddress: "",
          applicantMobile: "",
          problemDescription: "",
          selectedStateId: "",
          draft: null,
          replyText: "",
          replyAnalysis: null,
          currentStep: 1,
        }),
    }),
    {
      name: "rti-wizard-state",
    }
  )
);
