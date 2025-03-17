const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionarioController');

// 🔹 Criar um novo funcionário
router.post('/', funcionarioController.createFuncionario);

// 🔹 Buscar todos os funcionários
router.get('/', funcionarioController.getAllFuncionarios);

// 🔹 Buscar um funcionário por ID
router.get('/:id', funcionarioController.getFuncionarioById);

// 🔹 Atualizar um funcionário
router.put('/:id', funcionarioController.updateFuncionario);

// 🔹 Deletar um funcionário
router.delete('/:id', funcionarioController.deleteFuncionario);

module.exports = router;
