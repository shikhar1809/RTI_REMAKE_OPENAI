import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RTIApplication, MOCK_APPLICATIONS } from "@/data/mockRTIs";

interface ApplicationsState {
  applications: RTIApplication[];
  addApplication: (app: RTIApplication) => void;
  togglePublic: (id: string) => void;
  updateApplicationStatus: (id: string, status: RTIApplication["status"]) => void;
}

export const useApplicationsStore = create<ApplicationsState>()(
  persist(
    (set) => ({
      applications: MOCK_APPLICATIONS,
      addApplication: (app) => set((state) => ({ 
        applications: [app, ...state.applications] 
      })),
      togglePublic: (id) => set((state) => ({
        applications: state.applications.map(app => 
          app.id === id ? { ...app, isPublic: !app.isPublic } : app
        )
      })),
      updateApplicationStatus: (id, status) => set((state) => ({
        applications: state.applications.map(app =>
          app.id === id ? { ...app, status } : app
        )
      }))
    }),
    {
      name: "rti-applications",
    }
  )
);
