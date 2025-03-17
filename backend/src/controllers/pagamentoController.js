const { Pagamento, Pedido } = require('../models');
const { Op } = require('sequelize'); // Operadores para consultas dinâmicas

// 🔹 Criar um novo pagamento
exports.createPagamento = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar pagamento:", req.body);

        const { pedido_id, metodo_pagamento, status, transacao_id, valor_pago } = req.body;

        if (!pedido_id || !metodo_pagamento || !status || valor_pago === undefined) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const novoPagamento = await Pagamento.create({ pedido_id, metodo_pagamento, status, transacao_id, valor_pago });

        return res.status(201).json(novoPagamento);
    } catch (error) {
        console.error("Erro ao criar pagamento:", error);
        return res.status(500).json({ error: 'Erro ao criar pagamento', details: error.message });
    }
};

// 🔹 Buscar Pagamentos com Filtros Dinâmicos
exports.getPagamentos = async (req, res) => {
    try {
        const { pedido_id, metodo_pagamento, status, min_valor, max_valor, inicio, fim } = req.query;

        let where = {};
        if (pedido_id) where.pedido_id = pedido_id;
        if (metodo_pagamento) where.metodo_pagamento = metodo_pagamento;
        if (status) where.status = status;
        if (min_valor) where.valor_pago = { [Op.gte]: parseFloat(min_valor) };
        if (max_valor) where.valor_pago = { [Op.lte]: parseFloat(max_valor) };
        if (min_valor && max_valor) where.valor_pago = { [Op.between]: [parseFloat(min_valor), parseFloat(max_valor)] };
        if (inicio && fim) where.createdAt = { [Op.between]: [new Date(inicio), new Date(fim)] };

        const pagamentos = await Pagamento.findAll({
            where,
            include: { model: Pedido, as: 'pedido' }
        });

        res.json(pagamentos);
    } catch (error) {
        console.error("Erro ao buscar pagamentos:", error);
        res.status(500).json({ error: 'Erro ao buscar pagamentos', details: error.message });
    }
};

// 🔹 Buscar um pagamento por ID
exports.getPagamentoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pagamento = await Pagamento.findByPk(id, {
            include: { model: Pedido, as: 'pedido' }
        });

        if (!pagamento) {
            return res.status(404).json({ error: 'Pagamento não encontrado' });
        }

        res.json(pagamento);
    } catch (error) {
        console.error("Erro ao buscar pagamento:", error);
        res.status(500).json({ error: 'Erro ao buscar pagamento', details: error.message });
    }
};

// 🔹 Atualizar um pagamento
exports.updatePagamento = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, transacao_id, valor_pago } = req.body;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pagamento = await Pagamento.findByPk(id);
        if (!pagamento) {
            return res.status(404).json({ error: 'Pagamento não encontrado' });
        }

        await pagamento.update({ status, transacao_id, valor_pago });
        res.json(pagamento);
    } catch (error) {
        console.error("Erro ao atualizar pagamento:", error);
        res.status(500).json({ error: 'Erro ao atualizar pagamento', details: error.message });
    }
};

// 🔹 Deletar um pagamento
exports.deletePagamento = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pagamento = await Pagamento.findByPk(id);
        if (!pagamento) {
            return res.status(404).json({ error: 'Pagamento não encontrado' });
        }

        await pagamento.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar pagamento:", error);
        res.status(500).json({ error: 'Erro ao deletar pagamento', details: error.message });
    }
};
