import { createClient } from '@supabase/supabase-js';
import { url, key } from "../../supabase.json";

export const supabase = createClient(url, key);