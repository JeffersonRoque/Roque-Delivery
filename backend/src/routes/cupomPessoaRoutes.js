const express = require('express');
const cupomPessoaController = require('../controllers/cupomPessoaController');

const router = express.Router();

// 🔹 Associar um Cupom a uma Pessoa
router.post('/', cupomPessoaController.createCupomPessoa);

// 🔹 Buscar Cupons com Filtros Dinâmicos
router.get('/', cupomPessoaController.getAllCuponsPessoas);

// 🔹 Buscar Cupons de uma Pessoa (com filtro opcional de uso)
router.get('/pessoa/:pessoa_id', cupomPessoaController.getCuponsByPessoa);

// 🔹 Marcar um Cupom como Usado
router.put('/:id/usar', cupomPessoaController.useCupom);

// 🔹 Deletar uma Associação de Cupom e Pessoa
router.delete('/:id', cupomPessoaController.deleteCupomPessoa);

module.exports = router;
