const express = require('express');
const cupomPessoaController = require('../controllers/cupomPessoaController');

const router = express.Router();

// 🔹 Associar um Cupom a uma Pessoa
router.post('/', cupomPessoaController.createCupomPessoa);

// 🔹 Buscar todas as associações de Cupons e Pessoas
router.get('/', cupomPessoaController.getAllCuponsPessoas);

// 🔹 Buscar Cupons de uma Pessoa
router.get('/pessoa/:pessoa_id', cupomPessoaController.getCuponsByPessoa);

// 🔹 Buscar Cupons Não Utilizados de uma Pessoa
router.get('/pessoa/:pessoa_id/nao-usados', cupomPessoaController.getCuponsNaoUsados);

// 🔹 Marcar um Cupom como Usado
router.put('/usar/:id', cupomPessoaController.useCupom);

// 🔹 Deletar uma associação de Cupom e Pessoa
router.delete('/:id', cupomPessoaController.deleteCupomPessoa);

module.exports = router;