const express = require('express');
const cashbackController = require('../controllers/cashbackController');

const router = express.Router();

// 🔹 Criar um novo registro de Cashback
router.post('/', cashbackController.createCashback);

// 🔹 Buscar todos os Cashbacks (com filtros opcionais)
router.get('/', cashbackController.getAllCashbacks);

// 🔹 Buscar Cashback por ID da pessoa
router.get('/pessoa/:pessoa_id', cashbackController.getCashbackByPessoa);

// 🔹 Atualizar o saldo de Cashback
router.put('/pessoa/:pessoa_id', cashbackController.updateCashback);

// 🔹 Deletar um Cashback
router.delete('/pessoa/:pessoa_id', cashbackController.deleteCashback);

module.exports = router;
