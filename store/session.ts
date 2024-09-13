import { create } from "zustand";

interface SessionProps {
	id: string;
	name: string;
	email: string;
	access_token: string;
	role: string;
	expiration: string;
	session: {
		id: string;
		name: string;
		email: string;
		access_token: string;
		role: string;
		expiration: string;
	};
	setSession: (session: {
		id: string;
		name: string;
		email: string;
		access_token: string;
		role: string;
		expiration: string;
	}) => void;
}

export const useSessionStore = create((set) => ({
	session: {} as SessionProps,
	setSession: (session: SessionProps) => set({ session }),
}));
