const { Pedido, Pessoa } = require('../models');
const { Op } = require('sequelize'); // Operadores para consultas dinâmicas

// 🔹 Criar um novo pedido
exports.createPedido = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar pedido:", req.body);

        const { pessoa_id, preco_total, status } = req.body;

        if (!preco_total || !status) {
            return res.status(400).json({ error: 'Os campos preco_total e status são obrigatórios' });
        }

        const statusPermitidos = ['pendente', 'preparando', 'em_entrega', 'concluido', 'cancelado'];
        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({ error: 'Status inválido' });
        }

        if (pessoa_id) {
            const pessoa = await Pessoa.findByPk(pessoa_id);
            if (!pessoa) {
                return res.status(400).json({ error: 'Pessoa não encontrada' });
            }
        }

        const novoPedido = await Pedido.create({ pessoa_id, preco_total, status });
        return res.status(201).json(novoPedido);
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        return res.status(500).json({ error: 'Erro ao criar pedido', details: error.message });
    }
};

// 🔹 Buscar Pedidos com Filtros Dinâmicos
exports.getPedidos = async (req, res) => {
    try {
        const { pessoa_id, status, min_preco, max_preco, inicio, fim, limite, ordenacao } = req.query;

        let where = {};
        if (pessoa_id) where.pessoa_id = pessoa_id;
        if (status) where.status = status;
        if (min_preco) where.preco_total = { [Op.gte]: parseFloat(min_preco) };
        if (max_preco) where.preco_total = { [Op.lte]: parseFloat(max_preco) };
        if (min_preco && max_preco) where.preco_total = { [Op.between]: [parseFloat(min_preco), parseFloat(max_preco)] };
        if (inicio && fim) where.createdAt = { [Op.between]: [new Date(inicio), new Date(fim)] };

        const pedidos = await Pedido.findAll({
            where,
            order: [['createdAt', ordenacao === 'asc' ? 'ASC' : 'DESC']],
            limit: limite ? parseInt(limite) : null,
            include: { model: Pessoa, as: 'pessoa' }
        });

        res.json(pedidos);
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        res.status(500).json({ error: 'Erro ao buscar pedidos', details: error.message });
    }
};

// 🔹 Buscar um pedido por ID
exports.getPedidoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pedido = await Pedido.findByPk(id, { include: { model: Pessoa, as: 'pessoa' } });

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        res.json(pedido);
    } catch (error) {
        console.error("Erro ao buscar pedido:", error);
        res.status(500).json({ error: 'Erro ao buscar pedido', details: error.message });
    }
};

// 🔹 Atualizar um pedido
exports.updatePedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { pessoa_id, preco_total, status } = req.body;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        const statusPermitidos = ['pendente', 'preparando', 'em_entrega', 'concluido', 'cancelado'];
        if (status && !statusPermitidos.includes(status)) {
            return res.status(400).json({ error: 'Status inválido' });
        }

        if (pessoa_id) {
            const pessoa = await Pessoa.findByPk(pessoa_id);
            if (!pessoa) {
                return res.status(400).json({ error: 'Pessoa não encontrada' });
            }
        }

        await pedido.update(req.body);
        res.json(pedido);
    } catch (error) {
        console.error("Erro ao atualizar pedido:", error);
        res.status(500).json({ error: 'Erro ao atualizar pedido', details: error.message });
    }
};

// 🔹 Deletar um pedido
exports.deletePedido = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        await pedido.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar pedido:", error);
        res.status(500).json({ error: 'Erro ao deletar pedido', details: error.message });
    }
};
