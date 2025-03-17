const express = require('express');
const router = express.Router();
const notaFiscalController = require('../controllers/notaFiscalController');

// 🔹 Criar uma nova Nota Fiscal
router.post('/', notaFiscalController.createNotaFiscal);

// 🔹 Buscar Notas Fiscais com Filtros Dinâmicos
router.get('/', notaFiscalController.getNotasFiscais);

// 🔹 Buscar uma Nota Fiscal por ID
router.get('/:id', notaFiscalController.getNotaFiscalById);

// 🔹 Atualizar uma Nota Fiscal
router.put('/:id', notaFiscalController.updateNotaFiscal);

// 🔹 Deletar uma Nota Fiscal
router.delete('/:id', notaFiscalController.deleteNotaFiscal);

module.exports = router;
