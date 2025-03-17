const { ItensPedidoSubprodutos, ItensPedido, Subproduto, Pedido } = require('../models');
const { Op } = require('sequelize'); // Operadores para filtros dinâmicos

// 🔹 Criar uma nova relação entre item do pedido e subproduto
exports.createItemPedidoSubproduto = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar item_pedido_subproduto:", req.body);

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

// 🔹 Buscar relações entre Itens de Pedido e Subprodutos com Filtros Dinâmicos
exports.getItensPedidoSubprodutos = async (req, res) => {
    try {
        const { pedido_id, item_pedido_id, subproduto_id } = req.query;

        let where = {};
        if (pedido_id) where['$itemPedido.pedido_id$'] = pedido_id;
        if (item_pedido_id) where.item_pedido_id = item_pedido_id;
        if (subproduto_id) where.subproduto_id = subproduto_id;

        const itensPedidoSubprodutos = await ItensPedidoSubprodutos.findAll({
            where,
            include: [
                { model: ItensPedido, as: 'itemPedido', include: [{ model: Pedido, as: 'pedido' }] },
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

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const itemPedidoSubproduto = await ItensPedidoSubprodutos.findByPk(id, {
            include: [
                { model: ItensPedido, as: 'itemPedido', include: [{ model: Pedido, as: 'pedido' }] },
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

// 🔹 Atualizar um item_pedido_subproduto
exports.updateItemPedidoSubproduto = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantidade } = req.body;

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
