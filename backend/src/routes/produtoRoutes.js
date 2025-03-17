const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// 🔹 Criar um novo produto
router.post('/', produtoController.createProduto);

// 🔹 Buscar todos os produtos
router.get('/', produtoController.getAllProdutos);

// 🔹 Buscar um produto por ID
router.get('/:id', produtoController.getProdutoById);

// 🔹 Atualizar um produto
router.put('/:id', produtoController.updateProduto);

// 🔹 Deletar um produto
router.delete('/:id', produtoController.deleteProduto);

module.exports = router;
