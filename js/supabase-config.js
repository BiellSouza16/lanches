// Supabase Configuration
console.log('Inicializando Supabase...');

window.getSupabase = function () {

    if (window.supabase) {
        console.log('Supabase já existe');
        return window.supabase;
    }

    const supabaseUrl = 'https://vlnpsieyfiwnaxniqpma.supabase.co';
    const supabaseAnonKey = 'SUA_CHAVE_AQUI';

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Credenciais do Supabase não configuradas');
        return null;
    }

    window.supabase = window.supabase.createClient(
        supabaseUrl,
        supabaseAnonKey
    );

    console.log('Supabase inicializado com sucesso');
    return window.supabase;
};
