const express = require('express');
const router = express.Router();
const pessoaJuridicaController = require('../controllers/pessoaJuridicaController');

// 🔹 Criar uma nova pessoa jurídica
router.post('/', pessoaJuridicaController.create);

// 🔹 Buscar todas as pessoas jurídicas
router.get('/', pessoaJuridicaController.getAll);

// 🔹 Buscar uma pessoa jurídica pelo ID
router.get('/:id', pessoaJuridicaController.getById);

// 🔹 Atualizar uma pessoa jurídica
router.put('/:id', pessoaJuridicaController.update);

// 🔹 Deletar uma pessoa jurídica
router.delete('/:id', pessoaJuridicaController.delete);

module.exports = router;