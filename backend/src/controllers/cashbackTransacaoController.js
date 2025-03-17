const { CashbackTransacao, Pessoa, Pedido } = require('../models');
const { Op } = require('sequelize'); // Operadores para consultas avançadas

// 🔹 Criar uma nova transação de Cashback
exports.createTransacao = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar transação de cashback:", req.body);

        const { pessoa_id, pedido_id, valor, tipo_transacao } = req.body;

        if (!pessoa_id || !valor || !tipo_transacao) {
            return res.status(400).json({ error: 'Pessoa, valor e tipo de transação são obrigatórios' });
        }

        // Verificar se a pessoa existe
        const pessoa = await Pessoa.findByPk(pessoa_id);
        if (!pessoa) {
            return res.status(404).json({ error: 'Pessoa não encontrada' });
        }

        // Criar a transação
        const novaTransacao = await CashbackTransacao.create({
            pessoa_id,
            pedido_id: pedido_id || null,
            valor,
            tipo_transacao
        });

        return res.status(201).json(novaTransacao);
    } catch (error) {
        console.error("Erro ao criar transação de cashback:", error);
        return res.status(500).json({ error: 'Erro ao criar transação de cashback', details: error.message });
    }
};

// 🔹 Buscar todas as transações de Cashback (com filtros opcionais)
exports.getAllTransacoes = async (req, res) => {
    try {
        const { tipo, minimo, maximo, inicio, fim } = req.query;
        let where = {};

        // 🔹 Filtro por tipo de transação (credito/debito)
        if (tipo) {
            where.tipo_transacao = tipo;
        }

        // 🔹 Filtrar por valor mínimo e máximo
        if (minimo || maximo) {
            where.valor = {};
            if (minimo) where.valor[Op.gte] = parseFloat(minimo);
            if (maximo) where.valor[Op.lte] = parseFloat(maximo);
        }

        // 🔹 Filtrar por intervalo de datas
        if (inicio || fim) {
            where.criado_em = {};
            if (inicio) where.criado_em[Op.gte] = new Date(inicio);
            if (fim) where.criado_em[Op.lte] = new Date(fim);
        }

        const transacoes = await CashbackTransacao.findAll({
            where,
            include: [
                { model: Pessoa, as: 'pessoa' },
                { model: Pedido, as: 'pedido' }
            ],
            order: [['criado_em', 'DESC']]
        });

        res.json(transacoes);
    } catch (error) {
        console.error("Erro ao buscar transações de cashback:", error);
        res.status(500).json({ error: 'Erro ao buscar transações de cashback', details: error.message });
    }
};

// 🔹 Buscar transação por ID
exports.getTransacaoById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar UUID
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const transacao = await CashbackTransacao.findByPk(id, {
            include: [
                { model: Pessoa, as: 'pessoa' },
                { model: Pedido, as: 'pedido' }
            ]
        });

        if (!transacao) {
            return res.status(404).json({ error: 'Transação de cashback não encontrada' });
        }

        res.json(transacao);
    } catch (error) {
        console.error("Erro ao buscar transação de cashback:", error);
        res.status(500).json({ error: 'Erro ao buscar transação de cashback', details: error.message });
    }
};

// 🔹 Atualizar uma transação de Cashback
exports.updateTransacao = async (req, res) => {
    try {
        const { id } = req.params;
        const { valor, tipo_transacao } = req.body;

        // Validar UUID
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const transacao = await CashbackTransacao.findByPk(id);
        if (!transacao) {
            return res.status(404).json({ error: 'Transação de cashback não encontrada' });
        }

        await transacao.update({ valor, tipo_transacao });

        res.json(transacao);
    } catch (error) {
        console.error("Erro ao atualizar transação de cashback:", error);
        res.status(500).json({ error: 'Erro ao atualizar transação de cashback', details: error.message });
    }
};

// 🔹 Deletar uma transação de Cashback
exports.deleteTransacao = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar UUID
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const transacao = await CashbackTransacao.findByPk(id);
        if (!transacao) {
            return res.status(404).json({ error: 'Transação de cashback não encontrada' });
        }

        await transacao.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar transação de cashback:", error);
        res.status(500).json({ error: 'Erro ao deletar transação de cashback', details: error.message });
    }
};

console.log("Modelo CashbackTransacao carregado:", CashbackTransacao);
