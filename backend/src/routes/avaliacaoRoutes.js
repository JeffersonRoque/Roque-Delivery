const express = require('express');
const router = express.Router();
const avaliacoesController = require('../controllers/avaliacaoController');

// 🔹 Criar uma nova avaliação
router.post('/', avaliacoesController.createAvaliacao);

// 🔹 Buscar todas as avaliações (com filtros dinâmicos)
router.get('/', avaliacoesController.getAllAvaliacoes);

// 🔹 Buscar uma avaliação específica por ID
router.get('/:id', avaliacoesController.getAvaliacaoById);

// 🔹 Atualizar uma avaliação
router.put('/:id', avaliacoesController.updateAvaliacao);

// 🔹 Deletar uma avaliação
router.delete('/:id', avaliacoesController.deleteAvaliacao);

module.exports = router;
