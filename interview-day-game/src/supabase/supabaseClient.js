import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = "https://kmnvbraapppwhfwqjsnl.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
