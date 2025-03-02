# Documentação do Banco de Dados Sistema Roque Delivery

## Índice
- [Introdução](#introducao)
- [Objetivo do Banco de Dados](#objetivo-do-banco-de-dados)
- [Modelo de Dados](#modelo-de-dados)
  - [Diagrama ER](#diagrama-er)
- [Descrição das Entidades](#descricao-das-entidades)
- [Descrição das Tabelas](#descricao-das-tabelas)
  - [Nome da Tabela 1](#nome-da-tabela-1)
  - [Nome da Tabela 2](#nome-da-tabela-2)
- [Relacionamentos](#relacionamentos)
- [Procedures, Functions e Triggers](#procedures-functions-e-triggers)
- [Considerações de Segurança](#consideracoes-de-seguranca)
- [Backup e Recuperação](#backup-e-recuperacao)
- [Referências](#referencias)

---

## Introdução {#introducao}

O banco de dados do sistema **Roque Delivery** foi desenvolvido para gerenciar e controlar as operações de um sistema completo de entregas, integrando três aplicações distintas:

- **Aplicação Web de Gerenciamento:** para administração e monitoramento de todo o sistema, incluindo controle de pedidos, pagamentos, cashback, estoque e relatórios.
- **Aplicativo para Clientes:** permitindo que os usuários realizem pedidos de forma intuitiva e acompanhem o status de suas entregas.
- **Aplicativo para Motoristas:** para que os motoristas gerenciem suas rotas, recebam atualizações em tempo real e confirmem as entregas.

Essa estrutura integrada possibilita uma operação eficiente, garantindo a sincronização entre os diversos pontos de contato e a manutenção da integridade dos dados em todo o ecossistema de entregas.

---

## Objetivo do Banco de Dados {#objetivo-do-banco-de-dados}

O banco de dados do sistema **Roque Delivery** foi projetado para suportar integralmente as operações de um sistema de entregas integrado, que abrange três aplicações distintas: uma aplicação web para gerenciamento, um aplicativo para clientes e um aplicativo para motoristas. Seus principais objetivos são:

- **Integração de Operações:** Centralizar o gerenciamento de pedidos, pagamentos, cashback, logística, controle de estoque e relacionamento com clientes, garantindo a comunicação eficiente entre as diferentes aplicações.
- **Consistência e Integridade dos Dados:** Assegurar que informações críticas, como dados de usuários, produtos, transações e entregas, sejam armazenadas de forma consistente e confiável, utilizando um modelo relacional robusto.
- **Suporte a Processos de Negócio:** Facilitar a gestão de operações diárias, desde a realização do pedido pelo cliente até a entrega final pelo motorista, passando pela emissão de notas fiscais, controle de cupons, cashback e auditoria das transações.
- **Escalabilidade e Performance:** Permitir a expansão e a adaptação do sistema conforme o crescimento do negócio, mantendo um desempenho adequado mesmo em cenários de alta demanda.
- **Segurança e Auditoria:** Prover mecanismos para a proteção dos dados, incluindo a implementação de logs e auditoria, que possibilitam a rastreabilidade das operações e o monitoramento de alterações no sistema.

Essa estrutura visa oferecer uma experiência integrada e eficiente para todos os envolvidos, desde os administradores até os clientes e motoristas.

---

## Modelo de Dados {#modelo-de-dados}

O diagrama de classes a seguir apresenta uma visão detalhada da estrutura do banco de dados do sistema **Roque Delivery**. Nele, cada classe representa uma entidade do sistema, destacando seus atributos e os relacionamentos existentes entre elas. Essa representação facilita a compreensão da organização dos dados, evidenciando como as informações são interligadas para suportar as funcionalidades das três aplicações.

O diagrama ilustra, por exemplo, a distinção entre pessoas físicas e jurídicas, bem como os vínculos entre pedidos, pagamentos, entregas, cashback e outros componentes essenciais do sistema. Essa abordagem visual contribui para uma melhor análise e manutenção do modelo de dados, servindo de guia tanto para a implementação quanto para futuras expansões do sistema.

### Diagrama ER {#diagrama-er}
![alt text](<diagramas/Diagrama de Classes (UML).png>)

---

## Descrição das Entidades {#descricao-das-entidades}

A seguir, estão listadas as principais entidades que compõem o banco de dados do sistema **Roque Delivery**, juntamente com uma breve descrição de suas responsabilidades e relacionamentos:

- **Pessoas:** Armazena os dados gerais de todos os usuários do sistema, servindo como tabela central para clientes, funcionários e outros envolvidos nas operações.
- **Pessoa_Fisica:** Contém informações específicas de pessoas físicas, como CPF e data de nascimento, vinculadas a um registro na tabela Pessoas.
- **Pessoa_Juridica:** Registra dados específicos para pessoas jurídicas, incluindo CNPJ, razão social e nome fantasia, associadas a um registro em Pessoas.
- **Funcionários:** Representa os colaboradores do sistema, ligando o empregado (pessoa física) ao empregador (que pode ser pessoa física ou jurídica), definindo funções e cargos.
- **Motoristas:** Detalha as informações dos motoristas, que são um subconjunto dos funcionários, incluindo dados sobre o veículo utilizado e a placa.
- **Produtos:** Define os produtos disponíveis para pedidos, com atributos como nome, descrição, preço e estoque.
- **Subprodutos:** Permite a criação de variações ou componentes complementares aos produtos principais.
- **Pedidos:** Registra os pedidos realizados pelos clientes, armazenando informações como o valor total, o status do pedido e o vínculo com o cliente.
- **Itens_Pedido:** Descreve os itens que compõem cada pedido, detalhando as quantidades e preços unitários.
- **Itens_Pedido_Subprodutos:** Relaciona itens de pedido aos subprodutos, permitindo a inclusão de componentes adicionais.
- **Entregas:** Gerencia o processo de entrega, vinculando cada pedido a um motorista e monitorando o status da entrega.
- **Localizações:** Armazena informações geográficas (latitude e longitude) para rastreamento em tempo real.
- **Pagamentos:** Armazena os detalhes das transações de pagamento associadas aos pedidos.
- **Notas_Fiscais:** Documenta a emissão das notas fiscais dos pedidos.
- **Cupons:** Contém os cupons de desconto aplicáveis aos pedidos.
- **Cupons_Pessoas:** Relaciona os cupons aos clientes, registrando a utilização dos mesmos.
- **Cashback:** Gerencia o acúmulo de cashback dos clientes.
- **Cashback_Transacoes:** Registra as transações de crédito ou débito de cashback associadas a pedidos.
- **Cashback_Produtos:** Associa produtos a condições específicas de cashback.
- **Avaliações:** Armazena as avaliações e comentários realizados pelos clientes.
- **Relatórios:** Reúne os diferentes tipos de relatórios gerados pelo sistema.
- **Audit_Logs:** Mantém um registro das alterações realizadas nas tabelas do banco de dados.

---

## Descrição das Tabelas {#descricao-das-tabelas}

Nesta seção, apresentamos uma descrição detalhada de cada tabela que compõe o banco de dados do sistema **Roque Delivery**. Cada tabela foi estruturada para atender a aspectos específicos do sistema, garantindo a integridade e a consistência dos dados utilizados pelas três aplicações (web de gerenciamento, app para clientes e app para motoristas).

#### Tabela: Pessoas {#Pessoas}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| tipo_pessoa | VARCHAR(20) | CHECK (tipo_pessoa IN ('fisica', 'juridica')) NOT NULL, |
| nome | VARCHAR(100) | NOT NULL, |
| email | VARCHAR(100) | UNIQUE NOT NULL, |
| senha_hash | TEXT | NOT NULL, |
| telefone | VARCHAR(20), |  |
| endereco | TEXT, |  |
| criado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, |
| modificado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

### Tabela: Pessoa_Fisica {#Pessoa_Fisica}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| pessoa_id | UUID | UNIQUE NOT NULL, |
| cpf_hash | TEXT | UNIQUE, |
| data_nascimento | DATE, |  |
| FOREIGN | KEY | (pessoa_id) REFERENCES Pessoas(id) ON DELETE CASCADE |

#### Chaves Estrangeiras
| Coluna | Referencia Tabela | Referencia Coluna |
| ------ | ----------------- | ----------------- |
| pessoa_id | Pessoas | id |

---

### Tabela: Pessoa_Juridica {#Pessoa_Juridica}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| pessoa_id | UUID | UNIQUE NOT NULL, |
| cnpj | VARCHAR(18) | UNIQUE, |
| razao_social | VARCHAR(255) | NOT NULL, |
| nome_fantasia | VARCHAR(255), |  |
| inscricao_estadual | VARCHAR(50), |  |
| eh_empresa | BOOLEAN | DEFAULT TRUE, |
| FOREIGN | KEY | (pessoa_id) REFERENCES Pessoas(id) ON DELETE CASCADE |

#### Chaves Estrangeiras
| Coluna | Referencia Tabela | Referencia Coluna |
| ------ | ----------------- | ----------------- |
| pessoa_id | Pessoas | id |

---

### Tabela: Funcionarios {#Funcionarios}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| empregado_id | UUID | NOT NULL REFERENCES Pessoa_Fisica(id) ON DELETE CASCADE, -- Agora refere-se diretamente a Pessoas |
| empregador_id | UUID | NOT NULL REFERENCES Pessoas(id) ON DELETE CASCADE, -- Pode ser tanto PF quanto PJ |
| cargo | VARCHAR(100) | NOT NULL -- Ex: Gerente, Operador, Supervisor |

---

### Tabela: Motoristas {#Motoristas}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| funcionarios_id | UUID | UNIQUE NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE, |
| tipo_veiculo | VARCHAR(50), |  |
| placa_veiculo | VARCHAR(20) |  |

---

### Tabela: Produtos {#Produtos}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| nome | VARCHAR(100) | UNIQUE NOT NULL, |
| descricao | TEXT, |  |
| preco | DECIMAL(10,2) | NOT NULL, |
| estoque | INT | NOT NULL CHECK (estoque >= 0), |
| eh_alcoolico | BOOLEAN | DEFAULT FALSE, |
| criado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, |
| modificado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

### Tabela: Subprodutos {#Subprodutos}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT gen_random_uuid(), |
| nome | VARCHAR(100) | UNIQUE NOT NULL, |
| descricao | TEXT, |  |
| preco | DECIMAL(10,2) | NOT NULL CHECK (preco >= 0), |
| criado_em | TIMESTAMP | DEFAULT NOW(), |
| modificado_em | TIMESTAMP | DEFAULT NOW() |

---

### Tabela: Pedidos {#Pedidos}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| pessoa_id | UUID | NULL, -- Permitir valores NULL |
| preco_total | DECIMAL(10,2) | NOT NULL, |
| status | VARCHAR(50) | CHECK (status IN ('pendente', 'preparando', 'em_entrega', 'concluido', 'cancelado')), |
| criado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, |
| modificado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, |
| CONSTRAINT | pedidos_pessoa_id_fkey | FOREIGN KEY (pessoa_id) REFERENCES Pessoas(id) ON DELETE SET NULL |

#### Chaves Estrangeiras
| Coluna | Referencia Tabela | Referencia Coluna |
| ------ | ----------------- | ----------------- |
| pessoa_id | Pessoas | id |

---

### Tabela: Itens_Pedido {#Itens_Pedido}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| pedido_id | UUID | REFERENCES Pedidos(id), |
| produto_id | UUID | REFERENCES Produtos(id), |
| quantidade | INT | NOT NULL, |
| preco_unitario | DECIMAL(10,2) | NOT NULL, -- Adicionando o preço unitário |
| preco | DECIMAL(10,2) | NOT NULL -- Multiplicação entre preco_unitario * quantidade |

---

### Tabela: Itens_Pedido_Subprodutos {#Itens_Pedido_Subprodutos}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT gen_random_uuid(), |
| item_pedido_id | UUID | NOT NULL, |
| subproduto_id | UUID | NOT NULL, |
| quantidade | INT | NOT NULL CHECK (quantidade > 0), |
| CONSTRAINT | fk_item_pedido | FOREIGN KEY (item_pedido_id) REFERENCES Itens_Pedido(id) ON DELETE CASCADE, |
| CONSTRAINT | fk_subproduto | FOREIGN KEY (subproduto_id) REFERENCES Subprodutos(id) ON DELETE CASCADE |

#### Chaves Estrangeiras 
| Coluna | Referencia Tabela | Referencia Coluna |
| ------ | ----------------- | ----------------- |
| item_pedido_id | Itens_Pedido | id |
| subproduto_id | Subprodutos | id |

---

### Tabela: Entregas {#Entregas}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| pedido_id | UUID | REFERENCES Pedidos(id), |
| motorista_id | UUID | REFERENCES Motoristas(id), |
| status | VARCHAR(50) | CHECK (status IN ('pendente', 'em_transito', 'entregue', 'falhou')), |
| entregue_em | TIMESTAMP |  |

---

### Tabela: Localizacoes {#Localizacoes}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| pessoa_id | UUID | REFERENCES Pessoas(id), |
| motorista_id | UUID | REFERENCES Motoristas(id), |
| latitude | DECIMAL(10,6) | NOT NULL, |
| longitude | DECIMAL(10,6) | NOT NULL, |
| timestamp | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

### Tabela: Pagamentos {#Pagamentos}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| pedido_id | UUID | REFERENCES Pedidos(id), |
| metodo_pagamento | VARCHAR(50) | CHECK (metodo_pagamento IN ('cartao_credito', 'cartao_debito', 'pix', 'dinheiro')), |
| status | VARCHAR(50) | CHECK (status IN ('pendente', 'concluido', 'falhou')), |
| transacao_id | VARCHAR(100), |  |
| valor_pago | DECIMAL(10,2), |  |
| criado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, |
| modificado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

### Tabela: Notas_Fiscais {#Notas_Fiscais}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| pedido_id | UUID | UNIQUE NOT NULL REFERENCES Pedidos(id), -- Garante que um pedido só pode ter uma NF |
| emissor_id | UUID | NOT NULL REFERENCES Pessoas(id), -- Quem emitiu a nota |
| numero_nota | VARCHAR(50) | UNIQUE NOT NULL, -- Número da NF único |
| status | VARCHAR(20) | CHECK (status IN ('ativa', 'cancelada')) DEFAULT 'ativa', -- Status da NF |
| emitido_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, -- Data de emissão |
| modificado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP -- Data de modificação |

---

### Tabela: Cupons {#Cupons}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| codigo | VARCHAR(50) | UNIQUE NOT NULL, |
| descricao | TEXT, |  |
| desconto | DECIMAL(10,2) | CHECK (desconto > 0), |
| tipo_desconto | VARCHAR(20) | CHECK (tipo_desconto IN ('percentual', 'fixo')) NOT NULL, |
| valor_minimo | DECIMAL(10,2) | DEFAULT 0, |
| validade | TIMESTAMP, |  |
| quantidade_usos | INT | DEFAULT 1, |
| ativo | BOOLEAN | DEFAULT TRUE, |
| criado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, |
| modificado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| CONSTRAINT | chk_cupom_validade | CHECK (validade > NOW() OR validade IS NULL) |

---

### Tabela: Cupons_Pessoas {#Cupons_Pessoas}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| pessoa_id | UUID | REFERENCES Pessoas(id) ON DELETE CASCADE, |
| cupom_id | UUID | REFERENCES Cupons(id) ON DELETE CASCADE, |
| usado | BOOLEAN | DEFAULT FALSE, |
| usado_em | TIMESTAMP |  |

---

### Tabela: Cashback {#Cashback}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| pessoa_id | UUID | UNIQUE REFERENCES Pessoas(id) ON DELETE CASCADE, |
| valor_acumulado | DECIMAL(10,2) | DEFAULT 0 CHECK (valor_acumulado >= 0), |
| atualizado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, |
| modificado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

### Tabela: Cashback_Transacoes {#Cashback_Transacoes}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| pessoa_id | UUID | REFERENCES Pessoas(id) ON DELETE CASCADE, |
| pedido_id | UUID | REFERENCES Pedidos(id) ON DELETE SET NULL, |
| valor | DECIMAL(10,2) | CHECK (valor > 0), |
| tipo_transacao | VARCHAR(20) | CHECK (tipo_transacao IN ('credito', 'debito')) NOT NULL, |
| criado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, |
| modificado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

### Tabela: Cashback_Produtos {#Cashback_Produtos}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| produto_id | UUID | REFERENCES Produtos(id) ON DELETE CASCADE, |
| percentual_cashback | DECIMAL(5,2) | CHECK (percentual_cashback >= 0), |
| valor_fixo_cashback | DECIMAL(10,2) | CHECK (valor_fixo_cashback >= 0), |
| ativo | BOOLEAN | DEFAULT TRUE, |
| atualizado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, |
| modificado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

### Tabela: Avaliacoes {#Avaliacoes}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| pessoa_id | UUID | REFERENCES Pessoas(id), |
| motorista_id | UUID | REFERENCES Motoristas(id), |
| nota | INT | CHECK (nota BETWEEN 1 AND 5), |
| comentario | TEXT, |  |
| criado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

### Tabela: Relatorios {#Relatorios}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| tipo_relatorio | VARCHAR(50), |  |
| descricao | TEXT, |  |
| gerado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, |
| modificado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

### Tabela: Audit_Logs {#Audit_Logs}

| Coluna | Tipo de Dado | Detalhes |
| ------ | ------------- | -------- |
| id | UUID | PRIMARY KEY DEFAULT uuid_generate_v4(), |
| tabela_alvo | VARCHAR(50) | NOT NULL, |
| id_alvo | UUID | NOT NULL, |
| ip_usuario | VARCHAR(45), |  |
| coluna | VARCHAR(50) | NOT NULL, |
| valor_antigo | TEXT, |  |
| valor_novo | TEXT, |  |
| alterado_por | UUID | REFERENCES Pessoas(id), |
| alterado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

## Relacionamentos {#relacionamentos}

Os relacionamentos entre as tabelas do banco de dados do sistema **Roque Delivery** foram definidos para assegurar a integridade referencial e refletir as regras de negócio. Alguns dos principais vínculos incluem:

- **Pessoas & Pessoa_Fisica / Pessoa_Juridica:** Cada registro na tabela Pessoas pode ser complementado por informações específicas em Pessoa_Fisica (para indivíduos) ou Pessoa_Juridica (para empresas), configurando um relacionamento de 1:1.
- **Pessoas & Funcionários:** A tabela Funcionários utiliza referências à tabela Pessoas para identificar tanto o empregado (através de Pessoa_Fisica) quanto o empregador (que pode ser pessoa física ou jurídica).
- **Funcionários & Motoristas:** Quando um funcionário desempenha a função de motorista, há um relacionamento 1:1 entre Funcionários e Motoristas.
- **Pessoas & Pedidos:** Um cliente pode realizar múltiplos pedidos, estabelecendo uma relação 1:N.
- **Pedidos & Itens_Pedido:** Cada pedido pode conter vários itens, formando uma relação 1:N.
- **Itens_Pedido & Produtos:** Cada item de pedido está associado a um único produto (relação N:1).
- **Itens_Pedido & Itens_Pedido_Subprodutos:** Um item de pedido pode incluir componentes adicionais, configurando uma relação 1:N.
- **Itens_Pedido_Subprodutos & Subprodutos:** Cada registro nesta tabela referencia um subproduto específico (relação N:1).
- **Pedidos & Entregas:** Cada pedido possui uma única entrega associada.
- **Pessoas/Motoristas & Localizações:** Permite o rastreamento em tempo real com uma relação 1:N.
- **Pedidos & Pagamentos:** Um pedido pode ter uma ou mais transações de pagamento (relação 1:N).
- **Pedidos & Notas_Fiscais:** Cada pedido possui uma única nota fiscal (relação 1:1).
- **Pessoas & Cupons_Pessoas:** Um cliente pode ter vários cupons associados.
- **Pessoas & Cashback:** Cada cliente possui um registro único de cashback (relação 1:1).
- **Pessoas & Cashback_Transacoes:** Um cliente pode ter diversas transações de cashback (relação 1:N).
- **Produtos & Cashback_Produtos:** Cada produto pode estar associado a regras de cashback.
- **Pessoas & Avaliações:** As avaliações são registradas com referência à pessoa que as efetuou e ao motorista avaliado.
- **Relatórios & Audit_Logs:** Contribuem para a rastreabilidade e controle das alterações.

---

## Procedures, Functions e Triggers {#procedures-functions-e-triggers}

Esta seção descreve os mecanismos implementados para automatizar e reforçar as regras de negócio, assegurando a integridade e consistência dos dados:

- **Garantir que o Motorista seja um Funcionário Válido**
  - *Function:* `garantir_motorista_funcionario`  
    Verifica se o funcionário referenciado existe na tabela Funcionários antes de inserir um motorista.
  - *Trigger:* `trigger_garantir_motorista_funcionario`  
    Executada antes da inserção em Motoristas para validar a condição.

- **Verificar a Existência de Itens no Pedido**
  - *Function:* `verificar_item_pedido_existente`  
    Confirma se o item de pedido referenciado já existe na tabela Itens_Pedido antes de inserir um registro em Itens_Pedido_Subprodutos.
  - *Trigger:* `trigger_verificar_item_pedido`  
    Ativada antes de inserções em Itens_Pedido_Subprodutos.

- **Atualização Automática do Estoque**
  - *Function:* `atualizar_estoque_produto`  
    Atualiza o estoque dos produtos na tabela Produtos com base nas inserções e deleções em Itens_Pedido.
  - *Trigger:* `trigger_atualizar_estoque`  
    Executada após inserção ou deleção em Itens_Pedido.

- **Impedir Estoque Negativo**
  - *Function:* `impedir_estoque_negativo`  
    Verifica se há estoque suficiente antes de inserir um item em Itens_Pedido.
  - *Trigger:* `trigger_impedir_estoque_negativo`  
    Ativada antes da inserção em Itens_Pedido para evitar que o estoque se torne negativo.

- **Bloquear Exclusão de Notas Fiscais**
  - *Function:* `bloquear_exclusao_nota_fiscal`  
    Impede a exclusão de registros na tabela Notas_Fiscais, orientando que as notas devem ser canceladas.
  - *Trigger:* `trigger_bloquear_exclusao_nota_fiscal`  
    Executada antes de deleções em Notas_Fiscais.

- **Bloquear Alterações Indevidas na Nota Fiscal**
  - *Function:* `bloquear_alteracoes_nf`  
    Impede a alteração de campos críticos (pedido, emissor e número da nota) na tabela Notas_Fiscais.
  - *Trigger:* `trigger_bloquear_alteracoes_nf`  
    Executada antes de atualizações em Notas_Fiscais.

- **Validar a Validade dos Cupons**
  - *Function:* `validar_validade_cupom`  
    Verifica se o cupom ainda está dentro do prazo de validade antes de associá-lo a um cliente.
  - *Trigger:* `validar_validade_cupom`  
    Executada antes de inserções em Cupons_Pessoas.

---

## Considerações de Segurança {#consideracoes-de-seguranca}

A segurança dos dados é uma prioridade no desenvolvimento e manutenção do sistema **Roque Delivery**. Para proteger as informações e garantir a integridade do sistema, foram implementadas diversas práticas, tais como:

- **Criptografia e Armazenamento Seguro:** Uso de algoritmos de hash para senhas e dados sensíveis.
- **Controle de Acesso e Permissões:** Políticas de acesso rigorosas com perfis diferenciados.
- **Validação e Consistência dos Dados:** Funções e triggers que evitam inconsistências e alterações indevidas.
- **Auditoria e Monitoramento:** Registro detalhado de alterações na tabela Audit_Logs para rastreamento e auditoria.
- **Backup e Recuperação:** Estratégia robusta de backup e procedimentos de recuperação para garantir a continuidade das operações.

---

## Backup e Recuperação {#backup-e-recuperacao}

O sistema **Roque Delivery** adota uma estratégia robusta de backup e recuperação para garantir a integridade dos dados e a continuidade das operações, mesmo diante de falhas ou incidentes. As principais práticas adotadas incluem:

- **Backup Completo Diário:** Captura o estado integral dos dados diariamente.
- **Backups Incrementais:** Registra apenas as alterações desde o último backup completo.
- **Retenção e Armazenamento Seguro:** Backups armazenados em servidores seguros com redundância geográfica, mantendo os dados por até 30 dias.
- **Procedimentos de Recuperação:** Processos testados para a restauração rápida do banco de dados, minimizando o tempo de inatividade.
- **Monitoramento e Alertas:** Sistema de alertas para identificar falhas e permitir ações corretivas imediatas.

---

## Referências {#referencias}

- **PostgreSQL Documentation.** (n.d.). *The PostgreSQL Global Development Group.* Recuperado de [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)
- **PL/pgSQL – Procedural Language.** (n.d.). *PostgreSQL Documentation.* Recuperado de [https://www.postgresql.org/docs/current/plpgsql.html](https://www.postgresql.org/docs/current/plpgsql.html)
- **iFood.** (n.d.). Líder no mercado de delivery no Brasil. Informações disponíveis em fontes públicas e comunicados oficiais.
- **Zé Delivery.** (n.d.). Plataforma de delivery de bebidas. Base de estudo para operações e integração de sistemas de entregas.
- **Uai Rango.** (n.d.). Serviço de delivery regional com foco na personalização da experiência do usuário.
- **ChatGPT.** (2023). Assistente Virtual da OpenAI para Geração de Conteúdo e Suporte em Documentação. Recuperado de [https://chat.openai.com/](https://chat.openai.com/)

