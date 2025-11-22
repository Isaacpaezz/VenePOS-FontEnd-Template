// Simulación del cliente de Supabase
// En producción: import { createClient } from '@supabase/supabase-js';

export const supabase = {
  from: (table: string) => ({
    select: async () => {
      console.log(`Fetching from ${table}...`);
      return { data: [], error: null };
    },
    insert: async (data: any) => {
      console.log(`Inserting into ${table}:`, data);
      return { data, error: null };
    },
    update: async (data: any) => {
      console.log(`Updating ${table}:`, data);
      return { data, error: null };
    }
  }),
  auth: {
    getUser: async () => ({ data: { user: { email: 'admin@credicardpos.com' } }, error: null })
  }
};