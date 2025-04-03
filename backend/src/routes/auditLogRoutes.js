const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');

// 🔹 Criar um novo log de auditoria
router.post('/', auditLogController.createAuditLog);

// 🔹 Buscar todos os logs de auditoria com filtros dinâmicos
router.get('/', auditLogController.getAllAuditLogs);

// 🔹 Buscar um log de auditoria por ID
router.get('/:id', auditLogController.getAuditLogById);

// 🔹 Deletar um log de auditoria
router.delete('/:id', auditLogController.deleteAuditLog);

module.exports = router;
