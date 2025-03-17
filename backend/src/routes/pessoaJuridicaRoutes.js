const express = require('express');
const pessoaJuridicaController = require('../controllers/pessoaJuridicaController');

const router = express.Router();

// 🔹 Criar uma nova pessoa jurídica
router.post('/', pessoaJuridicaController.create);

// 🔹 Buscar pessoas jurídicas com filtros dinâmicos
router.get('/', pessoaJuridicaController.getAll);

// 🔹 Buscar uma pessoa jurídica pelo ID
router.get('/:id', pessoaJuridicaController.getById);

// 🔹 Atualizar uma pessoa jurídica
router.put('/:id', pessoaJuridicaController.update);

// 🔹 Deletar uma pessoa jurídica
router.delete('/:id', pessoaJuridicaController.delete);

module.exports = router;
