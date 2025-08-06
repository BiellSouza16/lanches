// Configuração do Supabase
const supabaseUrl = 'https://vlnpsieyfiwnaxniqpma.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbnBzaWV5Zml3bmF4bmlxcG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNzYxNzEsImV4cCI6MjA2OTg1MjE3MX0.2Aa6tIrQrGsleDy5UeoAVYBdKXrWpBMyWZoy_RAJaKE';

const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);