import { createClient } from "@supabase/supabase-js";
import { Database } from "./dbTypes";

const supabaseClient = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_API_KEY!,
);

export default supabaseClient;
