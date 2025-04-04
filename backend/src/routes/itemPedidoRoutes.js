const express = require('express');
const router = express.Router();
const itemPedidoController = require('../controllers/itemPedidoController');
const verificarIdadeCompra = require('../middlewares/verificarIdadeCompra');

// 🔹 Criar um novo item de pedido
router.post('/', verificarIdadeCompra, itemPedidoController.createItemPedido);

// 🔹 Buscar itens de pedidos com filtros dinâmicos
router.get('/', itemPedidoController.getItensPedidos);

// 🔹 Buscar um item de pedido por ID
router.get('/:id', itemPedidoController.getItemPedidoById);

// 🔹 Buscar os produtos mais pedidos
router.get('/relatorio/produtos-mais-pedidos', itemPedidoController.getProdutosMaisPedidos);

// 🔹 Buscar o total de vendas por produto
router.get('/relatorio/total-vendas-produto', itemPedidoController.getTotalVendasPorProduto);

// 🔹 Atualizar um item de pedido
router.put('/:id', itemPedidoController.updateItemPedido);

// 🔹 Deletar um item de pedido
router.delete('/:id', itemPedidoController.deleteItemPedido);

module.exports = router;
