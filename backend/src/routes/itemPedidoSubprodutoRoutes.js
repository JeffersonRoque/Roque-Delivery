const express = require('express');
const router = express.Router();
const itemPedidoSubprodutoController = require('../controllers/itemPedidoSubprodutoController');

// 🔹 Criar um novo item_pedido_subproduto
router.post('/', itemPedidoSubprodutoController.createItemPedidoSubproduto);

// 🔹 Buscar itens_pedido_subprodutos com filtros dinâmicos
router.get('/', itemPedidoSubprodutoController.getItensPedidoSubprodutos);

// 🔹 Buscar um item_pedido_subproduto por ID
router.get('/:id', itemPedidoSubprodutoController.getItemPedidoSubprodutoById);

// 🔹 Atualizar um item_pedido_subproduto
router.put('/:id', itemPedidoSubprodutoController.updateItemPedidoSubproduto);

// 🔹 Deletar um item_pedido_subproduto
router.delete('/:id', itemPedidoSubprodutoController.deleteItemPedidoSubproduto);

module.exports = router;
