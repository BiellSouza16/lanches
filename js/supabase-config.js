// Supabase Configuration
console.log('Inicializando Supabase...');

window.getSupabase = function () {

    if (window.supabaseClient) {
        console.log('Supabase já existe');
        return window.supabaseClient;
    }

    const supabaseUrl = 'https://vlnpsieyfiwnaxniqpma.supabase.co';
    const supabaseAnonKey = 'SUA_CHAVE_AQUI';

    if (!window.supabase) {
        console.error('Biblioteca do Supabase não carregada');
        return null;
    }

    window.supabaseClient = window.supabase.createClient(
        supabaseUrl,
        supabaseAnonKey
    );

    console.log('Supabase inicializado com sucesso');
    return window.supabaseClient;
};
