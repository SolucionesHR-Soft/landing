import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Cliente público: usa la anon key, protegido por las políticas RLS
// definidas en supabase/schema.sql (solo permite leer catálogos públicos
// e insertar contactos, nunca leer/editar datos sensibles).
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
