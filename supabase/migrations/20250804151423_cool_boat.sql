/*
  # Atualizar estrutura da tabela Lanches

  1. Mudanças na Tabela
    - Renomear tabela `launches` para `Lanches` (se necessário)
    - Adicionar campo `nome` para identificar quem fez o lançamento
    - Adicionar campo `tamanho` para diferenciar salgados 35g e 20g
    - Atualizar estrutura para suportar novos tipos de lançamento

  2. Novos Tipos
    - 'lanche' - Lanche de funcionário (máximo 5 itens incluindo suco)
    - 'perda' - Perdas de produtos (com tamanhos 35g e 20g)
    - 'sobra' - Sobras de produtos
    - 'transferencia' - Transferência Loja 2 para Loja 1

  3. Segurança
    - Manter RLS habilitado
    - Políticas para acesso público (sistema interno)
*/

-- Criar tabela Lanches se não existir
CREATE TABLE IF NOT EXISTS "Lanches" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL CHECK (tipo IN ('lanche', 'perda', 'sobra', 'transferencia')),
  funcionario text,
  nome text,
  itens jsonb NOT NULL DEFAULT '{}',
  suco text,
  quantidade_suco integer DEFAULT 0,
  tamanho text DEFAULT '35g' CHECK (tamanho IN ('35g', '20g')),
  data_hora timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE "Lanches" ENABLE ROW LEVEL SECURITY;

-- Criar política para acesso público
CREATE POLICY "Allow all operations on Lanches"
  ON "Lanches"
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_lanches_tipo ON "Lanches"(tipo);
CREATE INDEX IF NOT EXISTS idx_lanches_data_hora ON "Lanches"(data_hora);
CREATE INDEX IF NOT EXISTS idx_lanches_funcionario ON "Lanches"(funcionario);