-- Tabelas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela para cadastro de pessoas
CREATE TABLE Pessoas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo_pessoa VARCHAR(20) CHECK (tipo_pessoa IN ('fisica', 'juridica')) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    telefone VARCHAR(20) UNIQUE NOT NULL,
    endereco TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para cadastro de pessoas fisicas
CREATE TABLE Pessoa_Fisica (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pessoa_id UUID UNIQUE NOT NULL,
    cpf_hash TEXT UNIQUE,
    data_nascimento DATE,
    FOREIGN KEY (pessoa_id) REFERENCES Pessoas(id) ON DELETE CASCADE
);

-- Tabela para cadastro de empresas
CREATE TABLE Pessoa_Juridica (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pessoa_id UUID UNIQUE NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    inscricao_estadual VARCHAR(50),
	eh_empresa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (pessoa_id) REFERENCES Pessoas(id) ON DELETE CASCADE
);

-- Tabela para cadastro de funcionários
CREATE TABLE Funcionarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empregado_id UUID NOT NULL REFERENCES Pessoa_Fisica(id) ON DELETE CASCADE, -- Agora refere-se diretamente a Pessoas
    empregador_id UUID NOT NULL REFERENCES Pessoas(id) ON DELETE CASCADE, -- Pode ser tanto PF quanto PJ
    cargo VARCHAR(100) NOT NULL -- Ex: Gerente, Operador, Supervisor
);

-- Tabela para cadastro de motoristas
CREATE TABLE Motoristas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    funcionarios_id UUID UNIQUE NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
    tipo_veiculo VARCHAR(50),
    placa_veiculo VARCHAR(20)
);

-- Tabela para cadastro de produtos
CREATE TABLE Produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL CHECK (estoque >= 0),
    categorias VARCHAR(50),
	eh_alcoolico BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de cadastro de subprodutos (Extras)
CREATE TABLE Subprodutos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
    criado_em TIMESTAMP DEFAULT NOW(),
    modificado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela para pedidos
CREATE TABLE Pedidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pessoa_id UUID NULL, -- Permitir valores NULL
    preco_total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('pendente', 'preparando', 'em_entrega', 'concluido', 'cancelado')),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pedidos_pessoa_id_fkey FOREIGN KEY (pessoa_id) REFERENCES Pessoas(id) ON DELETE SET NULL
);

-- Tabela de relação entre produtos e pedidos
CREATE TABLE Itens_Pedido (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID REFERENCES Pedidos(id),
    produto_id UUID REFERENCES Produtos(id),
    quantidade INT NOT NULL,
	preco_unitario DECIMAL(10,2) NOT NULL, -- Adicionando o preço unitário
    preco DECIMAL(10,2) NOT NULL -- Multiplicação entre preco_unitario * quantidade
);

-- Tabela de relação entre Itens_Pedido e Subprodutos
CREATE TABLE Itens_Pedido_Subprodutos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_pedido_id UUID NOT NULL,
    subproduto_id UUID NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    CONSTRAINT fk_item_pedido FOREIGN KEY (item_pedido_id) REFERENCES Itens_Pedido(id) ON DELETE CASCADE,
    CONSTRAINT fk_subproduto FOREIGN KEY (subproduto_id) REFERENCES Subprodutos(id) ON DELETE CASCADE
);

-- Tabela de entrga dos produtos
CREATE TABLE Entregas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID REFERENCES Pedidos(id),
    motorista_id UUID REFERENCES Motoristas(id),
    status VARCHAR(50) CHECK (status IN ('pendente', 'em_transito', 'entregue', 'falhou')),
    entregue_em TIMESTAMP
);

-- Tabela de localização dos produtos | motoristas
CREATE TABLE Localizacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pessoa_id UUID REFERENCES Pessoas(id),
    motorista_id UUID REFERENCES Motoristas(id),
    latitude DECIMAL(10,6) NOT NULL,
    longitude DECIMAL(10,6) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela dos pagamentos
CREATE TABLE Pagamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID REFERENCES Pedidos(id),
    metodo_pagamento VARCHAR(50) CHECK (metodo_pagamento IN ('cartao_credito', 'cartao_debito', 'pix', 'dinheiro')),
    status VARCHAR(50) CHECK (status IN ('pendente', 'concluido', 'falhou')),
    transacao_id VARCHAR(100),
	valor_pago DECIMAL(10,2),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para emissão de Notas Fiscais
CREATE TABLE Notas_Fiscais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID UNIQUE NOT NULL REFERENCES Pedidos(id), -- Garante que um pedido só pode ter uma NF
    emissor_id UUID NOT NULL REFERENCES Pessoas(id), -- Quem emitiu a nota
    numero_nota VARCHAR(50) UNIQUE NOT NULL, -- Número da NF único
    status VARCHAR(20) CHECK (status IN ('ativa', 'cancelada')) DEFAULT 'ativa', -- Status da NF
    emitido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data de emissão
    modificado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Data de modificação
);

-- Tabelas de Cupons
CREATE TABLE Cupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descricao TEXT,
    desconto DECIMAL(10,2) CHECK (desconto > 0),
    tipo_desconto VARCHAR(20) CHECK (tipo_desconto IN ('percentual', 'fixo')) NOT NULL,
    valor_minimo DECIMAL(10,2) DEFAULT 0,
    validade TIMESTAMP,
    quantidade_usos INT DEFAULT 1,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,	
	-- Constraint para impedir a criação de cupons vencidos
    CONSTRAINT chk_cupom_validade CHECK (validade > NOW() OR validade IS NULL)
);

CREATE TABLE Cupons_Pessoas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pessoa_id UUID REFERENCES Pessoas(id) ON DELETE CASCADE,
    cupom_id UUID REFERENCES Cupons(id) ON DELETE CASCADE,
    usado BOOLEAN DEFAULT FALSE,
    usado_em TIMESTAMP
);

-- Tabelas de Cashback
CREATE TABLE Cashback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pessoa_id UUID UNIQUE REFERENCES Pessoas(id) ON DELETE CASCADE,
    valor_acumulado DECIMAL(10,2) DEFAULT 0 CHECK (valor_acumulado >= 0),
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	modificado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Cashback_Transacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pessoa_id UUID REFERENCES Pessoas(id) ON DELETE CASCADE,
    pedido_id UUID REFERENCES Pedidos(id) ON DELETE SET NULL,
    valor DECIMAL(10,2) CHECK (valor > 0),
    tipo_transacao VARCHAR(20) CHECK (tipo_transacao IN ('credito', 'debito')) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	modificado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Cashback_Produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    produto_id UUID REFERENCES Produtos(id) ON DELETE CASCADE,
    percentual_cashback DECIMAL(5,2) CHECK (percentual_cashback >= 0),
    valor_fixo_cashback DECIMAL(10,2) CHECK (valor_fixo_cashback >= 0),
    ativo BOOLEAN DEFAULT TRUE,
	atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	modificado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela das Avalições de clientes
CREATE TABLE Avaliacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pessoa_id UUID REFERENCES Pessoas(id),
    motorista_id UUID REFERENCES Motoristas(id),
    nota INT CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Relatórios
CREATE TABLE Relatorios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo_relatorio VARCHAR(50),
    descricao TEXT,
    gerado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	modificado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Log de Auditoria
CREATE TABLE Audit_Logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tabela_alvo VARCHAR(50) NOT NULL,
    id_alvo UUID NOT NULL,
	ip_usuario VARCHAR(45),
    coluna VARCHAR(50) NOT NULL,
    valor_antigo TEXT,
    valor_novo TEXT,
    alterado_por UUID REFERENCES Pessoas(id),
    alterado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- INDEX

CREATE INDEX idx_pedidos_pessoa ON Pedidos(pessoa_id);
CREATE INDEX idx_motoristas_funcionarios ON Motoristas(funcionarios_id);
CREATE INDEX idx_itens_pedido ON Itens_Pedido(pedido_id);
CREATE INDEX idx_itens_produto ON Itens_Pedido(produto_id);
CREATE INDEX idx_Pessoas_email ON Pessoas(email);
CREATE INDEX idx_Pessoas_telefone ON Pessoas(telefone);
CREATE INDEX idx_pagamentos_pedido_id ON Pagamentos (pedido_id);
CREATE INDEX idx_pagamentos_pedido_status_id ON Pagamentos (pedido_id, status);
CREATE INDEX idx_localizacoes_motorista ON Localizacoes(motorista_id);


------------------------------------------------------------------------------------------------
-- Triggers

-- Criar Garantia do Motorista ser Funcionário
CREATE OR REPLACE FUNCTION garantir_motorista_funcionario()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica se o funcionário existe antes de inserir como motorista
    IF NOT EXISTS (
        SELECT 1 FROM Funcionarios WHERE id = NEW.funcionarios_id
    ) THEN
        RAISE EXCEPTION 'O motorista precisa ser um funcionário válido.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criando trigger para verificar antes de inserir um motorista
CREATE TRIGGER trigger_garantir_motorista_funcionario
BEFORE INSERT ON Motoristas
FOR EACH ROW
EXECUTE FUNCTION garantir_motorista_funcionario();

-----------------------------------------------------------------------------------

-- Verificador se os Itens do Pedido Existente
CREATE OR REPLACE FUNCTION verificar_item_pedido_existente()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Itens_Pedido WHERE id = NEW.item_pedido_id) THEN
        RAISE EXCEPTION 'O item do pedido informado não existe!';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criando a trigger
CREATE TRIGGER trigger_verificar_item_pedido
BEFORE INSERT ON Itens_Pedido_Subprodutos
FOR EACH ROW EXECUTE FUNCTION verificar_item_pedido_existente();

-----------------------------------------------------------------------------------------------------------
-- Criar atualização do Estoque
-- Atualizar estoque do produto ao adicionar ou remover itens do pedido
CREATE OR REPLACE FUNCTION atualizar_estoque_produto()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE Produtos 
        SET estoque = estoque - NEW.quantidade, modificado_em = CURRENT_TIMESTAMP
        WHERE id = NEW.produto_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE Produtos 
        SET estoque = estoque + OLD.quantidade, modificado_em = CURRENT_TIMESTAMP
        WHERE id = OLD.produto_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_estoque
AFTER INSERT OR DELETE ON Itens_Pedido
FOR EACH ROW EXECUTE FUNCTION atualizar_estoque_produto();

----------------------------------------------------------------------------------------------------------------

-- Impedir que o estoque fique negativo ao adicionar um item no pedido
CREATE OR REPLACE FUNCTION impedir_estoque_negativo()
RETURNS TRIGGER AS $$
DECLARE
    estoque_atual INT;
BEGIN
    -- Buscar estoque atual e tratar caso o produto não exista
    SELECT COALESCE(estoque, 0) INTO estoque_atual FROM Produtos WHERE id = NEW.produto_id;

    -- Se o estoque for insuficiente, lançar erro
    IF estoque_atual < NEW.quantidade THEN
        RAISE EXCEPTION 'Estoque insuficiente para o produto %: disponível = %, solicitado = %',
            NEW.produto_id, estoque_atual, NEW.quantidade;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_impedir_estoque_negativo
BEFORE INSERT ON Itens_Pedido
FOR EACH ROW EXECUTE FUNCTION impedir_estoque_negativo();

----------------------------------------------------------------------------------------------

-- Trigger para impedir Exclusão NF
CREATE OR REPLACE FUNCTION bloquear_exclusao_nota_fiscal()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Notas fiscais não podem ser excluídas. Elas devem ser canceladas.';
END;
$$ LANGUAGE plpgsql;

-- Criando a trigger para o bloqueio da exclusão das NF
CREATE TRIGGER trigger_bloquear_exclusao_nota_fiscal
BEFORE DELETE ON Notas_Fiscais
FOR EACH ROW
EXECUTE FUNCTION bloquear_exclusao_nota_fiscal();

-------------------------------------------------------------------------------------------------

-- Função Unificada para Bloquear Alterações Indevidas (nº da NF | Emissor | Pedido)
CREATE OR REPLACE FUNCTION bloquear_alteracoes_nf()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.pedido_id IS DISTINCT FROM NEW.pedido_id THEN
        RAISE EXCEPTION 'O pedido vinculado à Nota Fiscal não pode ser alterado.';
    END IF;

    IF OLD.emissor_id IS DISTINCT FROM NEW.emissor_id THEN
        RAISE EXCEPTION 'O emissor da Nota Fiscal não pode ser alterado.';
    END IF;

    IF OLD.numero_nota IS DISTINCT FROM NEW.numero_nota THEN
        RAISE EXCEPTION 'O número da Nota Fiscal não pode ser alterado.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar a trigger única de bloqueio de alterações
CREATE TRIGGER trigger_bloquear_alteracoes_nf
BEFORE UPDATE ON Notas_Fiscais
FOR EACH ROW
EXECUTE FUNCTION bloquear_alteracoes_nf();

-----------------------------------------------------------------------------------------------------

-- Trigger para Impedir o Uso de Cupons Expirados
CREATE OR REPLACE FUNCTION validar_validade_cupom()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica se o cupom já expirou
    IF (SELECT validade FROM Cupons WHERE id = NEW.cupom_id) < NOW() THEN
        RAISE EXCEPTION 'Este cupom está expirado e não pode ser utilizado.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validar_validade_cupom
BEFORE INSERT ON Cupons_Pessoas
FOR EACH ROW
EXECUTE FUNCTION validar_validade_cupom();

