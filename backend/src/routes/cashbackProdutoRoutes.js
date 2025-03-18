const express = require('express');
const router = express.Router();
const cashbackProdutoController = require('../controllers/cashbackProdutoController');

// 🔹 Criar um novo Cashback para Produto
router.post('/', cashbackProdutoController.createCashbackProduto);

// 🔹 Buscar todos os Cashbacks para Produtos com filtros dinâmicos
router.get('/', cashbackProdutoController.getAllCashbackProdutos);

// 🔹 Buscar um Cashback de Produto por ID
router.get('/:id', cashbackProdutoController.getCashbackProdutoById);

// 🔹 Atualizar um Cashback de Produto
router.put('/:id', cashbackProdutoController.updateCashbackProduto);

// 🔹 Deletar um Cashback de Produto
router.delete('/:id', cashbackProdutoController.deleteCashbackProduto);

module.exports = router;
