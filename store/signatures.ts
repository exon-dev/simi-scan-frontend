import { create } from "zustand";

interface SignatureProps {
	title: string;
	author: string;
	original_signature_url: string;
	scanned_signature_url: string;
	user_id: string;
	signatures: {
		title: string;
		author: string;
		original_signature_url: string;
		scanned_signature_url: string;
		user_id: string;
	}[];
	setSignatures: (signatures: {
		title: string;
		author: string;
		original_signature_url: string;
		scanned_signature_url: string;
		user_id: string;
	}) => void;
}

export const useSignatureStore = () =>
	create((set) => ({
		signatures: [],
		setSignatures: (signatures: SignatureProps[]) => set({ signatures }),
	}));
