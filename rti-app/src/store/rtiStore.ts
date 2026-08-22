// RTI Wizard global state — Zustand store
// Decision D-011: Zustand for wizard state

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RTIDraft } from "@/data/mockDrafts";
import type { ReplyAnalysis } from "@/data/mockReplies";

export interface RTIWizardState {
  // Step 1: Problem description
  problemDescription: string;

  // Step 2: State selection
  selectedStateId: string;

  // Step 3: Generated draft
  draft: RTIDraft | null;

  // Reply checking
  replyText: string;
  replyAnalysis: ReplyAnalysis | null;

  // Wizard current step
  currentStep: number;

  // Actions
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
      problemDescription: "",
      selectedStateId: "",
      draft: null,
      replyText: "",
      replyAnalysis: null,
      currentStep: 1,

      setProblemDescription: (text) => set({ problemDescription: text }),
      setSelectedStateId: (id) => set({ selectedStateId: id }),
      setDraft: (draft) => set({ draft }),
      setReplyText: (text) => set({ replyText: text }),
      setReplyAnalysis: (analysis) => set({ replyAnalysis: analysis }),
      setCurrentStep: (step) => set({ currentStep: step }),
      resetWizard: () =>
        set({
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
