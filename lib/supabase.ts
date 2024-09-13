import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/global";

const supabase = createClient<Database>(
	process.env.EXPO_PUBLIC_SUPABASE_URL as string,
	process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string
);

export default supabase;
