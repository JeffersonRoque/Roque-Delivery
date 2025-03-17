const express = require('express');
const cupomController = require('../controllers/cupomController');

const router = express.Router();

// 🔹 Criar um novo Cupom
router.post('/', cupomController.createCupom);

// 🔹 Buscar Cupons com Filtros Dinâmicos
router.get('/', cupomController.getAllCupons);

// 🔹 Buscar um Cupom por ID
router.get('/:id', cupomController.getCupomById);

// 🔹 Atualizar um Cupom
router.put('/:id', cupomController.updateCupom);

// 🔹 Deletar um Cupom
router.delete('/:id', cupomController.deleteCupom);

module.exports = router;
