// Dados do sistema
const salgados = [
    'COXINHA',
    'BALÃOZINHO',
    'PALITINHO',
    'TRAVESSEIRINHO',
    'KIBE DE CARNE',
    'KIBE DE QUEIJO',
    'CHURROS DE DOCE DE LEITE',
    'CHURROS DE CHOCOLATE',
    'ENROLADINHO',
    'BOLIVIANO'
];

const sucos = ['Cajá', 'Acerola'];
const tamanhos = ['35g', '20g'];

const itensEstoque = [
    'AÇÚCAR',
    'ÁGUA SANITÁRIA',
    'ÁLCOOL',
    'CATCHUP',
    'COPO',
    'DESINFETANTE',
    'DETERGENTE',
    'ESPONJA',
    'GUARDANAPO',
    'MAIONESE',
    'PAPEL TOALHA',
    'SABÃO EM PÓ',
    'SACO DE 1KG',
    'SACO DE 2KG',
    'SACO DE 3KG',
    'SACOLA G',
    'SACOLA M',
    'SACOLA P',
    'SAL'
];

// Função para formatar nome do salgado
function formatSalgadoName(salgado, tamanho) {
    if (tamanho === '20g') {
        return `MINI ${salgado}`;
    }
    return salgado;
}
