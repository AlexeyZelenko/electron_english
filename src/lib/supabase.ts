import {createClient} from '@supabase/supabase-js';

if(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_KEY) {
    throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_KEY must be defined');
} else {
    console.log('Supabase URL and key are defined');
}


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);