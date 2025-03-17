const express = require('express');
const funcionarioController = require('../controllers/funcionarioController');

const router = express.Router();

// 🔹 Criar um novo funcionário
router.post('/', funcionarioController.createFuncionario);

// 🔹 Buscar funcionários com Filtros Dinâmicos (cargo, empregador_id, nome, data_inicio, data_fim)
router.get('/', funcionarioController.getFuncionarios);

// 🔹 Buscar um funcionário por ID
router.get('/:id', funcionarioController.getFuncionarioById);

// 🔹 Atualizar um funcionário
router.put('/:id', funcionarioController.updateFuncionario);

// 🔹 Deletar um funcionário
router.delete('/:id', funcionarioController.deleteFuncionario);

module.exports = router;
