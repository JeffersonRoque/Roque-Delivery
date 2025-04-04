const express = require('express');
const ProdutoSubproduto = require('../controllers/produtoSubprodutoController');

const router = express.Router();

// 🔹 Criar um novo produto
router.post('/', ProdutoSubproduto.createVinculo);

// 🔹 Buscar produtos com filtros dinâmicos
router.get('/', ProdutoSubproduto.getAllVinculos);

// 🔹 Buscar um produto por ID
router.get('/:id', ProdutoSubproduto.getVinculoById);

// 🔹 Atualizar um produto
router.put('/:id', ProdutoSubproduto.updateVinculo);

// 🔹 Deletar um produto
router.delete('/:id', ProdutoSubproduto.deleteVinculo);

module.exports = router;
