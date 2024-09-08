import { create } from "zustand";

interface User {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	isPasswordVisible: boolean;
	loading: boolean;
	isChecked: boolean;
	setName: (name: string) => void;
	setEmail: (email: string) => void;
	setPassword: (password: string) => void;
	setConfirmPassword: (confirmPassword: string) => void;
	setIsPasswordVisible: (isPasswordVisible: boolean) => void;
	setLoading: (loading: boolean) => void;
	setIsChecked: (isChecked: boolean) => void;
}

export const useUserStore = create<User>((set) => ({
	name: "",
	email: "",
	password: "",
	confirmPassword: "",
	isPasswordVisible: false,
	loading: false,
	isChecked: false,
	setName: (name) => set({ name }),
	setEmail: (email) => set({ email }),
	setPassword: (password) => set({ password }),
	setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
	setIsPasswordVisible: (isPasswordVisible) => set({ isPasswordVisible }),
	setLoading: (loading) => set({ loading }),
	setIsChecked: (isChecked) => set({ isChecked }),
}));
