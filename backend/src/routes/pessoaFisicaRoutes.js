const express = require('express');
const router = express.Router();
const pessoaFisicaController = require('../controllers/pessoaFisicaController');

// 🔹 Criar uma nova pessoa física
router.post('/', pessoaFisicaController.create);

// 🔹 Buscar todas as pessoas físicas
router.get('/', pessoaFisicaController.getAll);

// 🔹 Buscar uma pessoa física pelo ID
router.get('/:id', pessoaFisicaController.getById);

// 🔹 Atualizar uma pessoa física
router.put('/:id', pessoaFisicaController.update);

// 🔹 Deletar uma pessoa física
router.delete('/:id', pessoaFisicaController.delete);

module.exports = router;