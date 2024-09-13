import { create } from "zustand";

interface Alerts {
	message: string;
	setMessage: (message: string) => void;
}

export const useAlertsStore = create<Alerts>((set) => ({
	message: "",
	setMessage: (message) => set({ message }),
}));
