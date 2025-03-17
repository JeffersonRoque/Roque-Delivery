const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// 🔹 Criar um novo pedido
router.post('/', pedidoController.createPedido);

// 🔹 Buscar todos os pedidos
router.get('/', pedidoController.getAllPedidos);

// 🔹 Buscar um pedido pelo ID
router.get('/:id', pedidoController.getPedidoById);

// 🔹 Buscar pedidos por status
router.get('/status/:status', pedidoController.getPedidosByStatus);

// 🔹 Buscar pedidos de um cliente específico
router.get('/pessoa/:pessoa_id', pedidoController.getPedidosByPessoa);

// 🔹 Buscar pedidos dentro de um intervalo de datas
router.get('/periodo', pedidoController.getPedidosPorPeriodo);

// 🔹 Buscar últimos pedidos
router.get('/ultimos', pedidoController.getUltimosPedidos);

// 🔹 Buscar pedidos concluídos ou cancelados
router.get('/finalizados', pedidoController.getPedidosFinalizados);

// 🔹 Atualizar um pedido
router.put('/:id', pedidoController.updatePedido);

// 🔹 Deletar um pedido
router.delete('/:id', pedidoController.deletePedido);

module.exports = router;
