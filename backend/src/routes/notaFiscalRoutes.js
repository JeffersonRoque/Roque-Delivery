const express = require('express');
const notaFiscalController = require('../controllers/notaFiscalController');

const router = express.Router();

// 🔹 Criar uma nova Nota Fiscal
router.post('/', notaFiscalController.createNotaFiscal);

// 🔹 Buscar todas as Notas Fiscais
router.get('/', notaFiscalController.getAllNotasFiscais);

// 🔹 Buscar uma Nota Fiscal por ID
router.get('/:id', notaFiscalController.getNotaFiscalById);

// 🔹 Atualizar uma Nota Fiscal
router.put('/:id', notaFiscalController.updateNotaFiscal);

// 🔹 Deletar uma Nota Fiscal
router.delete('/:id', notaFiscalController.deleteNotaFiscal);

// 🔹 Buscar Nota Fiscal por Pedido
router.get('/pedido/:pedido_id', notaFiscalController.getNotaFiscalByPedido);

module.exports = router;