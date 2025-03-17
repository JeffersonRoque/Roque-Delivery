const express = require('express');
const router = express.Router();
const motoristaController = require('../controllers/motoristaController');

// 🔹 Criar um novo motorista
router.post('/', motoristaController.createMotorista);

// 🔹 Buscar todos os motoristas
router.get('/', motoristaController.getAllMotoristas);

// 🔹 Buscar um motorista por ID
router.get('/:id', motoristaController.getMotoristaById);

// 🔹 Atualizar um motorista
router.put('/:id', motoristaController.updateMotorista);

// 🔹 Deletar um motorista
router.delete('/:id', motoristaController.deleteMotorista);

module.exports = router;
