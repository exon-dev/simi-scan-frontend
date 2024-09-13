import { create } from "zustand";

interface SignatureProps {
	signature_id: number;
	title: string;
	author: string;
	original_signature_url: string;
	scanned_signature_url: string;
	user_id?: string;
	created_at: string;
}

interface SignatureStore {
	signatures: SignatureProps[];
	setSignatures: (signatures: SignatureProps[]) => void;
}

export const useSignatureStore = create<SignatureStore>((set) => ({
	signatures: [],
	setSignatures: (signatures) => set({ signatures }),
}));
