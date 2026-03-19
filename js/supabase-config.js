window.supabaseClient = null;

function initSupabase() {
    if (window.supabaseClient !== null) {
    return window.supabaseClient;
}

    try {
        if (!window.supabase || !window.supabase.createClient) {
            console.error('Supabase library não carregado corretamente');
            return null;
        }

        const supabaseUrl = 'https://vlnpsieyfiwnaxniqpma.supabase.co';
        const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbnBzaWV5Zml3bmF4bmlxcG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNzYxNzEsImV4cCI6MjA2OTg1MjE3MX0.2Aa6tIrQrGsleDy5UeoAVYBdKXrWpBMyWZoy_RAJaKE';

       window.supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
        console.log('Supabase inicializado com sucesso');
        return window.supabaseClient;
    } catch (error) {
        console.error('Erro ao inicializar Supabase:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
});
