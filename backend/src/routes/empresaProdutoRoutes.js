const express = require('express');
const empresaProdutoController = require('../controllers/empresaProdutoController');

const router = express.Router();

// 🔹 Criar
router.post('/', empresaProdutoController.createEmpresaProduto);

// 🔹 Buscar todos com filtros
router.get('/', empresaProdutoController.getAllEmpresaProdutos);

// 🔹 Buscar por ID
router.get('/:id', empresaProdutoController.getEmpresaProdutoById);

// 🔹 Atualizar
router.put('/:id', empresaProdutoController.updateEmpresaProduto);

// 🔹 Deletar
router.delete('/:id', empresaProdutoController.deleteEmpresaProduto);

module.exports = router;
