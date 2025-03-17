const express = require('express');
const router = express.Router();
const pessoaController = require('../controllers/pessoaController');

// 🔹 Criar uma nova pessoa
router.post('/', pessoaController.createPessoa);

// 🔹 Buscar todas as pessoas
router.get('/', pessoaController.getAllPessoas);

// 🔹 Buscar uma pessoa pelo ID
router.get('/:id', pessoaController.getPessoaById);

// 🔹 Atualizar uma pessoa
router.put('/:id', pessoaController.updatePessoa);

// 🔹 Deletar uma pessoa
router.delete('/:id', pessoaController.deletePessoa);

module.exports = router;