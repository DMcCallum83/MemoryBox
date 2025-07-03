import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eicyuiwqdorqzijuewnb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpY3l1aXdxZG9ycXppanVld25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjcyNDIsImV4cCI6MjA2NzA0MzI0Mn0.miXDscYd3gV6Vgv4_uvSCqaXMuzGOha_QDp83VsdjIU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
