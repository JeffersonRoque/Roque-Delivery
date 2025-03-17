const express = require('express');
const router = express.Router();
const cashbackTransacaoController = require('../controllers/cashbackTransacaoController');

// 🔹 Criar uma nova transação de cashback
router.post('/', cashbackTransacaoController.createTransacao);

// 🔹 Buscar todas as transações de cashback (com filtros opcionais)
router.get('/', cashbackTransacaoController.getAllTransacoes);

// 🔹 Buscar uma transação por ID
router.get('/:id', cashbackTransacaoController.getTransacaoById);

// 🔹 Atualizar uma transação de cashback
router.put('/:id', cashbackTransacaoController.updateTransacao);

// 🔹 Deletar uma transação de cashback
router.delete('/:id', cashbackTransacaoController.deleteTransacao);

module.exports = router;
