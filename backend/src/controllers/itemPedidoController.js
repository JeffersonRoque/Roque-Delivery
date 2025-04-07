const { ItemPedido, Pedido, empresaProduto } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// 🔹 Criar um novo item no pedido
exports.createItemPedido = async (req, res) => {
    try {
        console.log("Recebendo requisição para adicionar item ao pedido:", req.body);

        const { pedido_id, empresa_produto_id, quantidade, preco_unitario } = req.body;

        if (!pedido_id || !empresa_produto_id || !quantidade || !preco_unitario) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const pedido = await Pedido.findByPk(pedido_id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        const produto = await empresaProduto.findByPk(empresa_produto_id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto da empresa não encontrado' });
        }

        const subtotal = preco_unitario * quantidade;

        try {
            const novoItemPedido = await ItemPedido.create({ pedido_id, empresa_produto_id, quantidade, preco_unitario, subtotal });

            const produtoAtualizado = await empresaProduto.findByPk(empresa_produto_id);

            return res.status(201).json({ itemPedido: novoItemPedido, estoque_atualizado: produtoAtualizado.estoque });

        } catch (error) {
            console.error("Erro ao adicionar item ao pedido:", error);

            if (error.message.includes("Estoque insuficiente para o produto")) {
                return res.status(400).json({ error: 'Estoque insuficiente para este produto. Verifique a quantidade disponível antes de tentar novamente.' });
            }

            return res.status(500).json({ error: 'Erro ao adicionar item ao pedido', details: error.message });
        }
    } catch (error) {
        console.error("Erro ao adicionar item ao pedido:", error);
        return res.status(500).json({ error: 'Erro ao adicionar item ao pedido', details: error.message });
    }
};

// 🔹 Buscar Itens de Pedido com Filtros Dinâmicos
exports.getItensPedidos = async (req, res) => {
    try {
        const { pedido_id, empresa_produto_id, data_inicio, data_fim } = req.query;

        let where = {};
        if (pedido_id) where.pedido_id = pedido_id;
        if (empresa_produto_id) where.empresa_produto_id = empresa_produto_id;
        if (data_inicio && data_fim) {
            where.createdAt = { [Op.between]: [new Date(data_inicio), new Date(data_fim)] };
        }

        const itensPedidos = await ItemPedido.findAll({
            where,
            include: [
                { model: Pedido, as: 'pedido' },
                { model: empresaProduto, as: 'empresaProduto' }
            ]
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
            include: [
                { model: Pedido, as: 'pedido' },
                { model: empresaProduto, as: 'empresaProduto' }
            ]
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

// 🔹 Buscar os produtos mais pedidos
exports.getProdutosMaisPedidos = async (req, res) => {
    try {
        const produtosMaisPedidos = await ItemPedido.findAll({
            attributes: ['empresa_produto_id', [fn('SUM', col('quantidade')), 'total_vendido']],
            group: ['empresa_produto_id'],
            order: [[literal('total_vendido'), 'DESC']],
            include: [{ model: empresaProduto, as: 'empresaProduto' }]
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
            attributes: ['empresa_produto_id', [fn('SUM', col('preco')), 'total_faturado']],
            group: ['empresa_produto_id'],
            include: [{ model: empresaProduto, as: 'empresaProduto' }]
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

        const produto = await empresaProduto.findByPk(itemPedido.empresa_produto_id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto da empresa não encontrado' });
        }

        try {
            const subtotal = preco_unitario * quantidade;
            await itemPedido.update({ quantidade, preco_unitario, subtotal });

            const produtoAtualizado = await empresaProduto.findByPk(produto.id);

            res.json({ itemPedido, estoque_atualizado: produtoAtualizado.estoque });

        } catch (error) {
            console.error("Erro ao atualizar item de pedido:", error);

            if (error.message.includes("Estoque insuficiente para o produto")) {
                return res.status(400).json({ error: 'Estoque insuficiente para esta atualização. Verifique a quantidade disponível antes de tentar novamente.' });
            }

            res.status(500).json({ error: 'Erro ao atualizar item de pedido', details: error.message });
        }
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

        try {
            await itemPedido.destroy();

            const produtoAtualizado = await empresaProduto.findByPk(itemPedido.empresa_produto_id);

            res.status(204).json({ message: "Item removido com sucesso", estoque_atualizado: produtoAtualizado.estoque });

        } catch (error) {
            console.error("Erro ao deletar item de pedido:", error);
            res.status(500).json({ error: 'Erro ao deletar item de pedido', details: error.message });
        }
    } catch (error) {
        console.error("Erro ao deletar item de pedido:", error);
        res.status(500).json({ error: 'Erro ao deletar item de pedido', details: error.message });
    }
};
