export interface Database {
	public: {
		Tables: {
			movies: {
				Row: {
					id: number;
					name: string;
					data: Json | null;
				};
				Insert: {
					id?: never;
					name: string;
					data?: Json | null;
				};
				Update: {
					id?: never;
					name?: string;
					data?: Json | null;
				};
			};
		};
	};
}

export interface SignatureInfoProps {
	signature_id: number;
	title: string;
	author: string;
	original_signature_url: string;
	scanned_signature_url: string;
	created_at: string;
	handleDeleteSignature: (signature_id: number) => void;
}
