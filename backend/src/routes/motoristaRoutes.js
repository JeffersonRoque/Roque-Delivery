const express = require('express');
const router = express.Router();
const motoristaController = require('../controllers/motoristaController');

// 🔹 Criar um novo motorista
router.post('/', motoristaController.createMotorista);

// 🔹 Buscar motoristas com filtros dinâmicos
router.get('/', motoristaController.getMotoristas);

// 🔹 Buscar um motorista por ID
router.get('/:id', motoristaController.getMotoristaById);

// 🔹 Atualizar um motorista
router.put('/:id', motoristaController.updateMotorista);

// 🔹 Deletar um motorista
router.delete('/:id', motoristaController.deleteMotorista);

module.exports = router;
