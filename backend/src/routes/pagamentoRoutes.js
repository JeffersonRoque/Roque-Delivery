const express = require('express');
const pagamentoController = require('../controllers/pagamentoController');

const router = express.Router();

// 🔹 Criar um novo pagamento
router.post('/', pagamentoController.createPagamento);

// 🔹 Buscar todos os pagamentos
router.get('/', pagamentoController.getAllPagamentos);

// 🔹 Buscar um pagamento por ID
router.get('/:id', pagamentoController.getPagamentoById);

// 🔹 Atualizar um pagamento
router.put('/:id', pagamentoController.updatePagamento);

// 🔹 Deletar um pagamento
router.delete('/:id', pagamentoController.deletePagamento);

// 🔹 Buscar pagamentos por pedido
router.get('/pedido/:pedido_id', pagamentoController.getPagamentosByPedido);

module.exports = router;