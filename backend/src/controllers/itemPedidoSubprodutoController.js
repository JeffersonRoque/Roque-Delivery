const { ItemPedidoSubproduto, ItemPedido, Pedido, empresaSubproduto } = require('../models');
const { Op } = require('sequelize');

// 🔹 Criar uma nova relação entre item do pedido e subproduto
exports.createItemPedidoSubproduto = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar item_pedido_subproduto:", req.body);

        const { item_pedido_id, empresa_subproduto_id, quantidade } = req.body;

        if (!item_pedido_id || !empresa_subproduto_id || !quantidade) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const empresaSubprodutoEncontrado = await empresaSubproduto.findByPk(empresa_subproduto_id);
        if (!empresaSubprodutoEncontrado) {
            return res.status(404).json({ error: 'EmpresaSubproduto não encontrado' });
        }

        if (empresaSubprodutoEncontrado.estoque < quantidade) {
            return res.status(400).json({
                error: 'Estoque insuficiente para o subproduto da empresa',
                disponivel: empresaSubprodutoEncontrado.estoque,
                solicitado: quantidade
            });
        }

        const preco_unitario = empresaSubprodutoEncontrado.preco;
        const subtotal = preco_unitario * quantidade;

        const novoItemPedidoSubproduto = await ItemPedidoSubproduto.create({
            item_pedido_id,
            empresa_subproduto_id,
            quantidade,
            preco_unitario,
            subtotal
        });

        res.status(201).json(novoItemPedidoSubproduto);
    } catch (error) {
        console.error("Erro ao criar item_pedido_subproduto:", error);
        return res.status(500).json({ error: 'Erro ao criar item_pedido_subproduto', details: error.message });
    }
};

// 🔹 Buscar relações com Filtros Dinâmicos
exports.getItensPedidoSubprodutos = async (req, res) => {
    try {
        const { pedido_id, item_pedido_id, empresa_subproduto_id } = req.query;

        let where = {};
        if (pedido_id) where['$itemPedido.pedido_id$'] = pedido_id;
        if (item_pedido_id) where.item_pedido_id = item_pedido_id;
        if (empresa_subproduto_id) where.empresa_subproduto_id = empresa_subproduto_id;

        const itensPedidoSubprodutos = await ItemPedidoSubproduto.findAll({
            where,
            include: [
                { model: ItemPedido, as: 'itemPedido', include: [{ model: Pedido, as: 'pedido' }] },
                { model: empresaSubproduto, as: 'empresaSubproduto' }
            ]
        });

        res.json(itensPedidoSubprodutos);
    } catch (error) {
        console.error("Erro ao buscar itens_pedido_subprodutos:", error);
        res.status(500).json({ error: 'Erro ao buscar itens_pedido_subprodutos', details: error.message });
    }
};

// 🔹 Buscar por ID
exports.getItemPedidoSubprodutoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const itemPedidoSubproduto = await ItemPedidoSubproduto.findByPk(id, {
            include: [
                { model: ItemPedido, as: 'itemPedido', include: [{ model: Pedido, as: 'pedido' }] },
                { model: empresaSubproduto, as: 'empresaSubproduto' }
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

// 🔹 Atualizar item
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

        const empresaSubprodutoEncontrado = await empresaSubproduto.findByPk(itemPedidoSubproduto.empresa_subproduto_id);
        if (!empresaSubprodutoEncontrado) {
            return res.status(404).json({ error: 'EmpresaSubproduto não encontrado' });
        }

        const diferencaQuantidade = quantidade - itemPedidoSubproduto.quantidade;

        if (diferencaQuantidade > 0 && empresaSubprodutoEncontrado.estoque < diferencaQuantidade) {
            return res.status(400).json({
                error: 'Estoque insuficiente para o subproduto da empresa',
                disponivel: empresaSubprodutoEncontrado.estoque,
                solicitado: diferencaQuantidade
            });
        }

        await empresaSubprodutoEncontrado.update({
            estoque: empresaSubprodutoEncontrado.estoque - diferencaQuantidade
        });

        const preco_unitario = empresaSubprodutoEncontrado.preco;
        const subtotal = preco_unitario * quantidade;

        await itemPedidoSubproduto.update({ quantidade, preco_unitario, subtotal });

        res.json(itemPedidoSubproduto);
    } catch (error) {
        console.error("Erro ao atualizar item_pedido_subproduto:", error);
        res.status(500).json({ error: 'Erro ao atualizar item_pedido_subproduto', details: error.message });
    }
};

// 🔹 Deletar item
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

        const empresaSubprodutoEncontrado = await empresaSubproduto.findByPk(itemPedidoSubproduto.empresa_subproduto_id);
        if (empresaSubprodutoEncontrado) {
            await empresaSubprodutoEncontrado.update({
                estoque: empresaSubprodutoEncontrado.estoque + itemPedidoSubproduto.quantidade
            });
        }

        await itemPedidoSubproduto.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar item_pedido_subproduto:", error);
        res.status(500).json({ error: 'Erro ao deletar item_pedido_subproduto', details: error.message });
    }
};