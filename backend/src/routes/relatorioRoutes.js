const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');

// 🔹 Criar um novo relatório
router.post('/', relatorioController.createRelatorio);

// 🔹 Buscar todos os relatórios com filtros dinâmicos
router.get('/', relatorioController.getAllRelatorios);

// 🔹 Buscar um relatório por ID
router.get('/:id', relatorioController.getRelatorioById);

// 🔹 Atualizar um relatório
router.put('/:id', relatorioController.updateRelatorio);

// 🔹 Deletar um relatório
router.delete('/:id', relatorioController.deleteRelatorio);

module.exports = router;
