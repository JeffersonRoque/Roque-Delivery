const express = require('express');
const router = express.Router();
const itemPedidoController = require('../controllers/itemPedidoController');

// 🔹 Criar um novo item de pedido
router.post('/', itemPedidoController.createItemPedido);

// 🔹 Buscar todos os itens de pedidos
router.get('/', itemPedidoController.getAllItensPedido);

// 🔹 Buscar um item de pedido por ID
router.get('/:id', itemPedidoController.getItemPedidoById);

// 🔹 Buscar todos os itens de um pedido específico
router.get('/pedido/:pedido_id', itemPedidoController.getItensByPedidoId);

// 🔹 Buscar todos os pedidos que contêm um determinado produto
router.get('/produto/:produto_id', itemPedidoController.getPedidosByProdutoId);

// 🔹 Buscar os produtos mais pedidos
router.get('/relatorio/produtos-mais-pedidos', itemPedidoController.getProdutosMaisPedidos);

// 🔹 Buscar o total de vendas por produto
router.get('/relatorio/total-vendas-produto', itemPedidoController.getTotalVendasPorProduto);

// 🔹 Atualizar um item de pedido
router.put('/:id', itemPedidoController.updateItemPedido);

// 🔹 Deletar um item de pedido
router.delete('/:id', itemPedidoController.deleteItemPedido);

module.exports = router;