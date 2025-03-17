const express = require('express');
const pessoaFisicaController = require('../controllers/pessoaFisicaController');

const router = express.Router();

// 🔹 Criar uma nova pessoa física
router.post('/', pessoaFisicaController.create);

// 🔹 Buscar pessoas físicas com filtros dinâmicos
router.get('/', pessoaFisicaController.getAll);

// 🔹 Buscar uma pessoa física pelo ID
router.get('/:id', pessoaFisicaController.getById);

// 🔹 Atualizar uma pessoa física
router.put('/:id', pessoaFisicaController.update);

// 🔹 Deletar uma pessoa física
router.delete('/:id', pessoaFisicaController.delete);

module.exports = router;
