import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agzbkdinigtbadhdigig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnemJrZGluaWd0YmFkaGRpZ2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDE1MTQsImV4cCI6MjA5MDAxNzUxNH0.RRC9OLSiCcqunTej2auxoIIWU8l69NqkE6mxRovIU6U';
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
