const { ItemPedidoSubproduto, ItemPedido, Subproduto, Pedido } = require('../models');
const { Op } = require('sequelize'); // Operadores para filtros dinâmicos

// 🔹 Criar uma nova relação entre item do pedido e subproduto
exports.createItemPedidoSubproduto = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar item_pedido_subproduto:", req.body);

        const { item_pedido_id, subproduto_id, quantidade } = req.body;

        if (!item_pedido_id || !subproduto_id || !quantidade) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Verificar se o subproduto existe
        const subproduto = await Subproduto.findByPk(subproduto_id);
        if (!subproduto) {
            return res.status(404).json({ error: 'Subproduto não encontrado' });
        }

        // Verificar estoque disponível
        if (subproduto.estoque < quantidade) {
            return res.status(400).json({
                error: 'Estoque insuficiente para o subproduto',
                disponivel: subproduto.estoque,
                solicitado: quantidade
            });
        }

        // Criar o item subproduto
        const preco_unitario = subproduto.preco;
        const preco = preco_unitario * quantidade;

        const novoItemPedidoSubproduto = await ItemPedidoSubproduto.create({
            item_pedido_id,
            subproduto_id,
            quantidade,
            preco_unitario,
            preco
        });

        res.status(201).json(novoItemPedidoSubproduto);
    } catch (error) {
        console.error("Erro ao criar item_pedido_subproduto:", error);

        if (error.message.includes("Estoque insuficiente")) {
            return res.status(400).json({ error: 'Estoque insuficiente para este subproduto.' });
        }

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

        const itensPedidoSubprodutos = await ItemPedidoSubproduto.findAll({
            where,
            include: [
                { model: ItemPedido, as: 'itemPedido', include: [{ model: Pedido, as: 'pedido' }] },
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

        const itemPedidoSubproduto = await ItemPedidoSubproduto.findByPk(id, {
            include: [
                { model: ItemPedido, as: 'itemPedido', include: [{ model: Pedido, as: 'pedido' }] },
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

        const itemPedidoSubproduto = await ItemPedidoSubproduto.findByPk(id);
        if (!itemPedidoSubproduto) {
            return res.status(404).json({ error: 'Item Pedido Subproduto não encontrado' });
        }

        const subproduto = await Subproduto.findByPk(itemPedidoSubproduto.subproduto_id);
        if (!subproduto) {
            return res.status(404).json({ error: 'Subproduto não encontrado' });
        }

        // Calcular diferença de quantidade
        const diferencaQuantidade = quantidade - itemPedidoSubproduto.quantidade;

        // Verificar estoque
        if (diferencaQuantidade > 0 && subproduto.estoque < diferencaQuantidade) {
            return res.status(400).json({
                error: 'Estoque insuficiente para o subproduto',
                disponivel: subproduto.estoque,
                solicitado: diferencaQuantidade
            });
        }

        // Atualizar estoque do subproduto
        await subproduto.update({ estoque: subproduto.estoque - diferencaQuantidade });

        // Atualizar preço total do item
        const preco_unitario = subproduto.preco;
        const preco = preco_unitario * quantidade;

        await itemPedidoSubproduto.update({ quantidade, preco_unitario, preco });

        res.json(itemPedidoSubproduto);
    } catch (error) {
        console.error("Erro ao atualizar item_pedido_subproduto:", error);

        if (error.message.includes("violates check constraint")) {
            return res.status(400).json({ error: 'A nova quantidade do subproduto não é permitida.' });
        }

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

        const itemPedidoSubproduto = await ItemPedidoSubproduto.findByPk(id);
        if (!itemPedidoSubproduto) {
            return res.status(404).json({ error: 'Item Pedido Subproduto não encontrado' });
        }

        // Devolver o estoque do subproduto antes de deletar
        const subproduto = await Subproduto.findByPk(itemPedidoSubproduto.subproduto_id);
        if (subproduto) {
            await subproduto.update({ estoque: subproduto.estoque + itemPedidoSubproduto.quantidade });
        }

        await itemPedidoSubproduto.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar item_pedido_subproduto:", error);
        res.status(500).json({ error: 'Erro ao deletar item_pedido_subproduto', details: error.message });
    }
};
