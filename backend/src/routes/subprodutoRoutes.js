const express = require('express');
const router = express.Router();
const subprodutoController = require('../controllers/subprodutoController');

// 🔹 Criar um novo subproduto
router.post('/', subprodutoController.createSubproduto);

// 🔹 Buscar todos os subprodutos
router.get('/', subprodutoController.getAllSubprodutos);

// 🔹 Buscar um subproduto por ID
router.get('/:id', subprodutoController.getSubprodutoById);

// 🔹 Atualizar um subproduto
router.put('/:id', subprodutoController.updateSubproduto);

// 🔹 Deletar um subproduto
router.delete('/:id', subprodutoController.deleteSubproduto);

module.exports = router;
