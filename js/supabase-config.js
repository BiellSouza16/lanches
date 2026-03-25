// Supabase Configuration
console.log('Inicializando Supabase...');

window.getSupabase = function () {

    if (window.supabaseClient) {
        console.log('Supabase já existe');
        return window.supabaseClient;
    }

    const supabaseUrl = 'https://vlnpsieyfiwnaxniqpma.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbnBzaWV5Zml3bmF4bmlxcG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNzYxNzEsImV4cCI6MjA2OTg1MjE3MX0.2Aa6tIrQrGsleDy5UeoAVYBdKXrWpBMyWZoy_RAJaKE';

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Credenciais do Supabase não configuradas');
        return null;
    }

    const supabaseLib = window.supabase; // biblioteca CDN

    window.supabaseClient = supabaseLib.createClient(
        supabaseUrl,
        supabaseAnonKey
    );

    console.log('Supabase inicializado com sucesso');
    return window.supabaseClient;
};
