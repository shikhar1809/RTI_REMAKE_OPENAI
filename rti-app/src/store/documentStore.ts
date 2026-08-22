import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DocumentStatus = "linked" | "missing";

export interface UserDocument {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  verified: boolean;
}

interface DocumentState {
  documents: UserDocument[];
  lastSynced: string | null;
  syncBPL: () => Promise<void>;
  isBPLVerified: () => boolean;
}

const INITIAL_DOCS: UserDocument[] = [
  {
    id: "aadhaar",
    name: "Aadhaar Card",
    type: "Identity & Address Proof",
    status: "linked",
    verified: true,
  },
  {
    id: "pan",
    name: "PAN Card",
    type: "Identity Proof",
    status: "linked",
    verified: true,
  },
  {
    id: "bpl",
    name: "BPL Ration Card",
    type: "Fee Exemption Proof",
    status: "missing",
    verified: false,
  },
];

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documents: INITIAL_DOCS,
      lastSynced: null,
      syncBPL: async () => {
        // Fake delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === "bpl" ? { ...doc, status: "linked", verified: true } : doc
          ),
          lastSynced: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }));
      },
      isBPLVerified: () => {
        return get().documents.find((d) => d.id === "bpl")?.verified ?? false;
      },
    }),
    {
      name: "rti-documents-storage",
    }
  )
);
