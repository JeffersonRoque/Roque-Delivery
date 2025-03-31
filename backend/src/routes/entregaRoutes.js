const express = require('express');
const entregaController = require('../controllers/entregaController');

const router = express.Router();

// 🔹 Criar uma nova entrega
router.post('/', entregaController.createEntrega);

// 🔹 Buscar entregas com Filtros Dinâmicos (status, motorista_id, pedido_id, período de data)
router.get('/', entregaController.getEntregas);

// 🔹 Buscar uma entrega por ID
router.get('/:id', entregaController.getEntregaById);

// 🔹 Atualizar uma entrega
router.put('/:id', entregaController.updateEntrega);

// 🔹 Atualizar motorista
router.put('/:id', entregaController.reatribuirMotorista);

// 🔹 Deletar uma entrega
router.delete('/:id', entregaController.deleteEntrega);

module.exports = router;
