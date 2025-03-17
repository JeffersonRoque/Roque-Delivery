const express = require('express');
const router = express.Router();
const cashbackProdutoController = require('../controllers/cashbackProdutoController');

// 🔹 Criar um novo Cashback para Produto
router.post('/', cashbackProdutoController.create);

// 🔹 Buscar todos os Cashbacks para Produtos com filtros dinâmicos
router.get('/', cashbackProdutoController.getAll);

// 🔹 Buscar um Cashback de Produto por ID
router.get('/:id', cashbackProdutoController.getById);

// 🔹 Atualizar um Cashback de Produto
router.put('/:id', cashbackProdutoController.update);

// 🔹 Deletar um Cashback de Produto
router.delete('/:id', cashbackProdutoController.delete);

module.exports = router;
