const { ItemPedido, Pedido, Produto } = require('../models'); // Importando corretamente do index.js
const { Op } = require('sequelize'); // Operadores para consultas

// 🔹 Criar um novo item no pedido
exports.createItemPedido = async (req, res) => {
    try {
        console.log("Recebendo requisição para adicionar item ao pedido:", req.body); // Debug

        const { pedido_id, produto_id, quantidade, preco_unitario } = req.body;

        if (!pedido_id || !produto_id || !quantidade || !preco_unitario) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const pedido = await Pedido.findByPk(pedido_id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        const produto = await Produto.findByPk(produto_id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        if (produto.estoque < quantidade) {
            return res.status(400).json({ error: 'Estoque insuficiente para este produto' });
        }

        const preco = preco_unitario * quantidade;

        const novoItemPedido = await ItemPedido.create({ pedido_id, produto_id, quantidade, preco_unitario, preco });

        // Atualiza o estoque do produto
        await produto.update({ estoque: produto.estoque - quantidade });

        return res.status(201).json(novoItemPedido);
    } catch (error) {
        console.error("Erro ao adicionar item ao pedido:", error);
        return res.status(500).json({ error: 'Erro ao adicionar item ao pedido', details: error.message });
    }
};

// 🔹 Buscar todos os itens de pedidos
exports.getAllItensPedidos = async (req, res) => {
    try {
        const itensPedidos = await ItemPedido.findAll({
            include: [{ model: Pedido, as: 'pedido' }, { model: Produto, as: 'produto' }]
        });
        res.json(itensPedidos);
    } catch (error) {
        console.error("Erro ao buscar itens de pedidos:", error);
        res.status(500).json({ error: 'Erro ao buscar itens de pedidos', details: error.message });
    }
};

// 🔹 Buscar um item de pedido por ID
exports.getItemPedidoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const itemPedido = await ItemPedido.findByPk(id, {
            include: [{ model: Pedido, as: 'pedido' }, { model: Produto, as: 'produto' }]
        });

        if (!itemPedido) {
            return res.status(404).json({ error: 'Item de pedido não encontrado' });
        }
        res.json(itemPedido);
    } catch (error) {
        console.error("Erro ao buscar item de pedido:", error);
        res.status(500).json({ error: 'Erro ao buscar item de pedido', details: error.message });
    }
};

// 🔹 Buscar todos os itens de um pedido específico
exports.getItensByPedidoId = async (req, res) => {
    try {
        const { pedido_id } = req.params;

        if (!pedido_id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID do pedido inválido' });
        }

        const itensPedido = await ItemPedido.findAll({
            where: { pedido_id },
            include: [{ model: Produto, as: 'produto' }]
        });

        if (itensPedido.length === 0) {
            return res.status(404).json({ error: 'Nenhum item encontrado para este pedido' });
        }

        res.json(itensPedido);
    } catch (error) {
        console.error("Erro ao buscar itens do pedido:", error);
        res.status(500).json({ error: 'Erro ao buscar itens do pedido', details: error.message });
    }
};

// 🔹 Buscar todos os pedidos que contêm um determinado produto
exports.getPedidosByProdutoId = async (req, res) => {
    try {
        const { produto_id } = req.params;

        if (!produto_id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID do produto inválido' });
        }

        const pedidos = await ItemPedido.findAll({
            where: { produto_id },
            include: [{ model: Pedido, as: 'pedido' }]
        });

        if (pedidos.length === 0) {
            return res.status(404).json({ error: 'Nenhum pedido encontrado para este produto' });
        }

        res.json(pedidos);
    } catch (error) {
        console.error("Erro ao buscar pedidos por produto:", error);
        res.status(500).json({ error: 'Erro ao buscar pedidos por produto', details: error.message });
    }
};

// 🔹 Buscar os produtos mais pedidos
exports.getProdutosMaisPedidos = async (req, res) => {
    try {
        const produtosMaisPedidos = await ItemPedido.findAll({
            attributes: ['produto_id', [sequelize.fn('SUM', sequelize.col('quantidade')), 'total_vendido']],
            group: ['produto_id'],
            order: [[sequelize.literal('total_vendido'), 'DESC']],
            include: [{ model: Produto, as: 'produto' }]
        });

        res.json(produtosMaisPedidos);
    } catch (error) {
        console.error("Erro ao buscar produtos mais pedidos:", error);
        res.status(500).json({ error: 'Erro ao buscar produtos mais pedidos', details: error.message });
    }
};

// 🔹 Buscar o total de vendas por produto
exports.getTotalVendasPorProduto = async (req, res) => {
    try {
        const totalVendasPorProduto = await ItemPedido.findAll({
            attributes: ['produto_id', [sequelize.fn('SUM', sequelize.col('preco')), 'total_faturado']],
            group: ['produto_id'],
            include: [{ model: Produto, as: 'produto' }]
        });

        res.json(totalVendasPorProduto);
    } catch (error) {
        console.error("Erro ao buscar total de vendas por produto:", error);
        res.status(500).json({ error: 'Erro ao buscar total de vendas por produto', details: error.message });
    }
};

// 🔹 Atualizar um item de pedido
exports.updateItemPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantidade, preco_unitario } = req.body;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const itemPedido = await ItemPedido.findByPk(id);
        if (!itemPedido) {
            return res.status(404).json({ error: 'Item de pedido não encontrado' });
        }

        const produto = await Produto.findByPk(itemPedido.produto_id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        const diferencaQuantidade = quantidade - itemPedido.quantidade;

        if (produto.estoque < diferencaQuantidade) {
            return res.status(400).json({ error: 'Estoque insuficiente para esta atualização' });
        }

        const preco = preco_unitario * quantidade;

        await itemPedido.update({ quantidade, preco_unitario, preco });

        // Atualiza o estoque do produto
        await produto.update({ estoque: produto.estoque - diferencaQuantidade });

        res.json(itemPedido);
    } catch (error) {
        console.error("Erro ao atualizar item de pedido:", error);
        res.status(500).json({ error: 'Erro ao atualizar item de pedido', details: error.message });
    }
};

// 🔹 Deletar um item de pedido
exports.deleteItemPedido = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const itemPedido = await ItemPedido.findByPk(id);
        if (!itemPedido) {
            return res.status(404).json({ error: 'Item de pedido não encontrado' });
        }

        const produto = await Produto.findByPk(itemPedido.produto_id);
        if (produto) {
            await produto.update({ estoque: produto.estoque + itemPedido.quantidade });
        }

        await itemPedido.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar item de pedido:", error);
        res.status(500).json({ error: 'Erro ao deletar item de pedido', details: error.message });
    }
};
