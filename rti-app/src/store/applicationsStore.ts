import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RTIApplication, MOCK_APPLICATIONS } from "@/data/mockRTIs";

interface ApplicationsState {
  applications: RTIApplication[];
  addApplication: (app: RTIApplication) => void;
}

export const useApplicationsStore = create<ApplicationsState>()(
  persist(
    (set) => ({
      applications: MOCK_APPLICATIONS,
      addApplication: (app) => set((state) => ({ 
        applications: [app, ...state.applications] 
      })),
    }),
    {
      name: "rti-applications",
    }
  )
);
