const express = require('express');
const pessoaController = require('../controllers/pessoaController');

const router = express.Router();

// 🔹 Criar uma nova pessoa
router.post('/', pessoaController.createPessoa);

// 🔹 Buscar pessoas com filtros dinâmicos
router.get('/', pessoaController.getPessoas);

// 🔹 Buscar uma pessoa pelo ID
router.get('/:id', pessoaController.getPessoaById);

// 🔹 Atualizar uma pessoa
router.put('/:id', pessoaController.updatePessoa);

// 🔹 Deletar uma pessoa
router.delete('/:id', pessoaController.deletePessoa);

module.exports = router;
