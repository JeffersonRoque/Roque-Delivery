const express = require('express');
const empresaSubprodutoController = require('../controllers/empresaSubprodutoController'); // ajuste o caminho conforme sua estrutura

const router = express.Router();

// 🔹 Criar novo EmpresaSubproduto
router.post('/', empresaSubprodutoController.createEmpresaSubproduto);

// 🔹 Buscar todos com filtros
router.get('/', empresaSubprodutoController.getAllEmpresaSubprodutos);

// 🔹 Buscar por ID
router.get('/:id', empresaSubprodutoController.getEmpresaSubprodutoById);

// 🔹 Atualizar por ID
router.put('/:id', empresaSubprodutoController.updateEmpresaSubproduto);

// 🔹 Deletar por ID
router.delete('/:id', empresaSubprodutoController.deleteEmpresaSubproduto);

module.exports = router;
