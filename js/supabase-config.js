// Supabase Configuration
console.log('Inicializando Supabase...');

window.getSupabase = function () {

    if (window.supabaseClient) {
        console.log('Supabase já existe');
        return window.supabaseClient;
    }

    const supabaseUrl = 'https://vlnpsieyfiwnaxniqpma.supabase.co';
    const supabaseAnonKey = 'SUA_KEY_AQUI';

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
