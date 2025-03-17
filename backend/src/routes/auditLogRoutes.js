const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');

// 🔹 Criar um novo log de auditoria
router.post('/audit-logs', auditLogController.createAuditLog);

// 🔹 Buscar todos os logs de auditoria com filtros dinâmicos
router.get('/audit-logs', auditLogController.getAllAuditLogs);

// 🔹 Buscar um log de auditoria por ID
router.get('/audit-logs/:id', auditLogController.getAuditLogById);

// 🔹 Deletar um log de auditoria
router.delete('/audit-logs/:id', auditLogController.deleteAuditLog);

module.exports = router;
