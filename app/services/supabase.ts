import { createClient } from "@supabase/supabase-js";
import { Database } from "types/database.types";

const supabaseUrl = "https://szbmxdncecrrtsqmwuba.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY ?? "";
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
