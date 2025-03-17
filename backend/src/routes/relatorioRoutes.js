const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');

// 🔹 Criar um novo relatório
router.post('/relatorios', relatorioController.createRelatorio);

// 🔹 Buscar todos os relatórios com filtros dinâmicos
router.get('/relatorios', relatorioController.getAllRelatorios);

// 🔹 Buscar um relatório por ID
router.get('/relatorios/:id', relatorioController.getRelatorioById);

// 🔹 Atualizar um relatório
router.put('/relatorios/:id', relatorioController.updateRelatorio);

// 🔹 Deletar um relatório
router.delete('/relatorios/:id', relatorioController.deleteRelatorio);

module.exports = router;
