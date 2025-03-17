const express = require('express');
const pagamentoController = require('../controllers/pagamentoController');

const router = express.Router();

// 🔹 Criar um novo pagamento
router.post('/', pagamentoController.createPagamento);

// 🔹 Buscar Pagamentos com Filtros Dinâmicos
router.get('/', pagamentoController.getPagamentos);

// 🔹 Buscar um pagamento por ID
router.get('/:id', pagamentoController.getPagamentoById);

// 🔹 Atualizar um pagamento
router.put('/:id', pagamentoController.updatePagamento);

// 🔹 Deletar um pagamento
router.delete('/:id', pagamentoController.deletePagamento);

module.exports = router;
