const express = require('express');
const router = express.Router();
const itemPedidoSubprodutoController = require('../controllers/itemPedidoSubprodutoController');

// 🔹 Criar um novo item_pedido_subproduto
router.post('/', itemPedidoSubprodutoController.createItemPedidoSubproduto);

// 🔹 Buscar todos os itens_pedido_subprodutos
router.get('/', itemPedidoSubprodutoController.getAllItensPedidoSubprodutos);

// 🔹 Buscar um item_pedido_subproduto por ID
router.get('/:id', itemPedidoSubprodutoController.getItemPedidoSubprodutoById);

// 🔹 Buscar subprodutos de um pedido
router.get('/pedido/:pedido_id', itemPedidoSubprodutoController.getByPedidoId);

// 🔹 Buscar subprodutos de um item_pedido específico
router.get('/item-pedido/:item_pedido_id', itemPedidoSubprodutoController.getByItemPedidoId);

// 🔹 Buscar todos os pedidos que contêm um subproduto específico
router.get('/subproduto/:subproduto_id', itemPedidoSubprodutoController.getBySubprodutoId);

// 🔹 Atualizar um item_pedido_subproduto
router.put('/:id', itemPedidoSubprodutoController.updateItemPedidoSubproduto);

// 🔹 Deletar um item_pedido_subproduto
router.delete('/:id', itemPedidoSubprodutoController.deleteItemPedidoSubproduto);

module.exports = router;
