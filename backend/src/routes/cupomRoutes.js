const express = require('express');
const cupomController = require('../controllers/cupomController');

const router = express.Router();

// 🔹 Criar um novo Cupom
router.post('/', cupomController.createCupom);

// 🔹 Buscar todos os Cupons
router.get('/', cupomController.getAllCupons);

// 🔹 Buscar um Cupom por ID
router.get('/:id', cupomController.getCupomById);

// 🔹 Buscar um Cupom por Código
router.get('/codigo/:codigo', cupomController.getCupomByCodigo);

// 🔹 Buscar apenas Cupons Ativos
router.get('/ativos', cupomController.getCuponsAtivos);

// 🔹 Atualizar um Cupom
router.put('/:id', cupomController.updateCupom);

// 🔹 Deletar um Cupom
router.delete('/:id', cupomController.deleteCupom);

module.exports = router;