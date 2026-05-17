-- 1. Tabela de Usuários 
create table usuarios (
  id uuid primary key default gen_random_uuid(), -- gen_random_uuid() é o padrão do Supabase
  nome text not null,
  cpf text not null unique,
  telefone text, 
  email text not null unique,
  senha TEXT NOT NULL,
  tipo text check (tipo in ('paciente', 'biomedico')) default 'paciente',
  criado_em timestamp default now()
);

-- 2. Tabela de Exames
-- Aqui se guarda o catalogo: o nome do exame e os valores de referência.
create table exames (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  valor_referencia_min numeric(10,2),
  valor_referencia_max numeric(10,2),
  unidade_medida text, -- Ex: "mg/dL"
  ativo boolean default true,
  criado_em timestamp default now()
);

-- 3. Tabela de Laudos/Solicitações
-- Onde o paciente vê o status do seu exame.
create table laudos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios(id) on delete cascade,
  resultado numeric(10,2), -- O valor que o biomédico vai inserir
  status text check (status in ('pendente', 'finalizado')) default 'pendente',
  data_solicitacao timestamp default now(),
  data_finalizacao timestamp
);

-- 4. Tabela de Itens do Laudo
-- Caso uma solicitação tenha vários exames (ex: Glicose + Hemograma).
create table itens_laudo (
  id uuid primary key default gen_random_uuid(),
  laudo_id uuid references laudos(id) on delete cascade,
  exame_id uuid references exames(id),
  preco_exame numeric(10,2) -- caso o exame seja pago
);

-- Conta do Biomedico feita somente pelo banco de dados
INSERT INTO usuarios (nome, cpf, telefone, email, tipo) 
VALUES ('Dr. Roberto', '123.456.789-10', '(81) 9999-9999', 'roberto@biomed.com', 'biomedico');

-- Inserindo um Exame
INSERT INTO exames (nome, descricao, valor_referencia_min, valor_referencia_max, unidade_medida) 
VALUES ('Glicose', 'Jejum obrigatório', 70, 99, 'mg/dL');

ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE exames DISABLE ROW LEVEL SECURITY;
ALTER TABLE laudos DISABLE ROW LEVEL SECURITY;
ALTER TABLE itens_laudo DISABLE ROW LEVEL SECURITY;