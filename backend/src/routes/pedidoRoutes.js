const express = require('express');
const pedidoController = require('../controllers/pedidoController');

const router = express.Router();

// 🔹 Criar um novo pedido
router.post('/', pedidoController.createPedido);

// 🔹 Buscar pedidos com filtros dinâmicos
router.get('/', pedidoController.getPedidos);

// 🔹 Buscar um pedido pelo ID
router.get('/:id', pedidoController.getPedidoById);

// 🔹 Atualizar um pedido
router.put('/:id', pedidoController.updatePedido);

// 🔹 Deletar um pedido
router.delete('/:id', pedidoController.deletePedido);

module.exports = router;
