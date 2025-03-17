const express = require('express');
const entregaController = require('../controllers/entregaController');

const router = express.Router();

// 🔹 Criar uma nova entrega
router.post('/', entregaController.createEntrega);

// 🔹 Buscar todas as entregas
router.get('/', entregaController.getAllEntregas);

// 🔹 Buscar uma entrega por ID
router.get('/:id', entregaController.getEntregaById);

// 🔹 Buscar entregas por status (pendente, em_transito, entregue, falhou)
router.get('/status/:status', entregaController.getEntregasByStatus);

// 🔹 Buscar todas as entregas de um motorista específico
router.get('/motorista/:motorista_id', entregaController.getEntregasByMotorista);

// 🔹 Atualizar uma entrega
router.put('/:id', entregaController.updateEntrega);

// 🔹 Deletar uma entrega
router.delete('/:id', entregaController.deleteEntrega);

module.exports = router;