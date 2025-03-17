const { ItensPedidoSubprodutos, ItensPedido, Subproduto } = require('../models'); // Importando corretamente do index.js
const { Op } = require('sequelize'); // Operadores para consultas

// 🔹 Criar uma nova relação entre item do pedido e subproduto
exports.createItemPedidoSubproduto = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar item_pedido_subproduto:", req.body); // Debug

        const { item_pedido_id, subproduto_id, quantidade } = req.body;

        if (!item_pedido_id || !subproduto_id || !quantidade) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const novoItemPedidoSubproduto = await ItensPedidoSubprodutos.create({ item_pedido_id, subproduto_id, quantidade });

        return res.status(201).json(novoItemPedidoSubproduto);
    } catch (error) {
        console.error("Erro ao criar item_pedido_subproduto:", error);
        return res.status(500).json({ error: 'Erro ao criar item_pedido_subproduto', details: error.message });
    }
};

// 🔹 Buscar todas as relações entre Itens de Pedido e Subprodutos
exports.getAllItensPedidoSubprodutos = async (req, res) => {
    try {
        const itensPedidoSubprodutos = await ItensPedidoSubprodutos.findAll({
            include: [
                { model: ItensPedido, as: 'itemPedido' },
                { model: Subproduto, as: 'subproduto' }
            ]
        });

        res.json(itensPedidoSubprodutos);
    } catch (error) {
        console.error("Erro ao buscar itens_pedido_subprodutos:", error);
        res.status(500).json({ error: 'Erro ao buscar itens_pedido_subprodutos', details: error.message });
    }
};

// 🔹 Buscar um item_pedido_subproduto por ID
exports.getItemPedidoSubprodutoById = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica se o ID é um UUID válido
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const itemPedidoSubproduto = await ItensPedidoSubprodutos.findByPk(id, {
            include: [
                { model: ItensPedido, as: 'itemPedido' },
                { model: Subproduto, as: 'subproduto' }
            ]
        });

        if (!itemPedidoSubproduto) {
            return res.status(404).json({ error: 'Item Pedido Subproduto não encontrado' });
        }
        res.json(itemPedidoSubproduto);
    } catch (error) {
        console.error("Erro ao buscar item_pedido_subproduto:", error);
        res.status(500).json({ error: 'Erro ao buscar item_pedido_subproduto', details: error.message });
    }
};

// 🔹 Buscar todos os subprodutos de um pedido específico
exports.getByPedidoId = async (req, res) => {
    try {
        const { pedido_id } = req.params;

        const itens = await ItensPedidoSubprodutos.findAll({
            include: [
                {
                    model: ItensPedido,
                    as: 'itemPedido',
                    where: { pedido_id }
                },
                { model: Subproduto, as: 'subproduto' }
            ]
        });

        if (itens.length === 0) {
            return res.status(404).json({ error: 'Nenhum subproduto encontrado para este pedido' });
        }

        res.json(itens);
    } catch (error) {
        console.error("Erro ao buscar subprodutos do pedido:", error);
        res.status(500).json({ error: 'Erro ao buscar subprodutos do pedido', details: error.message });
    }
};

// 🔹 Buscar todos os subprodutos de um item de pedido
exports.getByItemPedidoId = async (req, res) => {
    try {
        const { item_pedido_id } = req.params;

        const itens = await ItensPedidoSubprodutos.findAll({
            where: { item_pedido_id },
            include: [{ model: Subproduto, as: 'subproduto' }]
        });

        if (itens.length === 0) {
            return res.status(404).json({ error: 'Nenhum subproduto encontrado para este item do pedido' });
        }

        res.json(itens);
    } catch (error) {
        console.error("Erro ao buscar subprodutos do item do pedido:", error);
        res.status(500).json({ error: 'Erro ao buscar subprodutos do item do pedido', details: error.message });
    }
};

// 🔹 Buscar todos os pedidos que contêm um determinado subproduto
exports.getBySubprodutoId = async (req, res) => {
    try {
        const { subproduto_id } = req.params;

        const itens = await ItensPedidoSubprodutos.findAll({
            where: { subproduto_id },
            include: [
                {
                    model: ItensPedido,
                    as: 'itemPedido',
                    include: [{ model: Pedido, as: 'pedido' }]
                }
            ]
        });

        if (itens.length === 0) {
            return res.status(404).json({ error: 'Nenhum pedido encontrado com este subproduto' });
        }

        res.json(itens);
    } catch (error) {
        console.error("Erro ao buscar pedidos pelo subproduto:", error);
        res.status(500).json({ error: 'Erro ao buscar pedidos pelo subproduto', details: error.message });
    }
};

// 🔹 Atualizar um item_pedido_subproduto
exports.updateItemPedidoSubproduto = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantidade } = req.body;

        // Verifica se o ID é um UUID válido
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const itemPedidoSubproduto = await ItensPedidoSubprodutos.findByPk(id);

        if (!itemPedidoSubproduto) {
            return res.status(404).json({ error: 'Item Pedido Subproduto não encontrado' });
        }

        await itemPedidoSubproduto.update({ quantidade });
        res.json(itemPedidoSubproduto);
    } catch (error) {
        console.error("Erro ao atualizar item_pedido_subproduto:", error);
        res.status(500).json({ error: 'Erro ao atualizar item_pedido_subproduto', details: error.message });
    }
};

// 🔹 Deletar um item_pedido_subproduto
exports.deleteItemPedidoSubproduto = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica se o ID é um UUID válido
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const itemPedidoSubproduto = await ItensPedidoSubprodutos.findByPk(id);

        if (!itemPedidoSubproduto) {
            return res.status(404).json({ error: 'Item Pedido Subproduto não encontrado' });
        }

        await itemPedidoSubproduto.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar item_pedido_subproduto:", error);
        res.status(500).json({ error: 'Erro ao deletar item_pedido_subproduto', details: error.message });
    }
};
