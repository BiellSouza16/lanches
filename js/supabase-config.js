import { createClient } from
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

export const supabase = createClient(
  'https://vlnpsieyfiwnaxniqpma.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbnBzaWV5Zml3bmF4bmlxcG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNzYxNzEsImV4cCI6MjA2OTg1MjE3MX0.2Aa6tIrQrGsleDy5UeoAVYBdKXrWpBMyWZoy_RAJaKE'
);
