const express = require('express');
const subprodutoController = require('../controllers/subprodutoController');

const router = express.Router();

// 🔹 Criar um novo subproduto
router.post('/', subprodutoController.createSubproduto);

// 🔹 Buscar subprodutos com filtros dinâmicos
router.get('/', subprodutoController.getAllSubprodutos);

// 🔹 Buscar um subproduto por ID
router.get('/:id', subprodutoController.getSubprodutoById);

// 🔹 Atualizar um subproduto
router.put('/:id', subprodutoController.updateSubproduto);

// 🔹 Deletar um subproduto
router.delete('/:id', subprodutoController.deleteSubproduto);

module.exports = router;
