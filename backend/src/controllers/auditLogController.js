const { AuditLog } = require('../models');
const { Op } = require('sequelize');

// 🔹 Criar um novo log de auditoria
exports.createAuditLog = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar log de auditoria:", req.body);

        const { tabela_alvo, id_alvo, ip_usuario, coluna, valor_antigo, valor_novo, alterado_por } = req.body;

        if (!tabela_alvo || !id_alvo || !coluna || !alterado_por) {
            return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
        }

        const novoLog = await AuditLog.create({ tabela_alvo, id_alvo, ip_usuario, coluna, valor_antigo, valor_novo, alterado_por });

        return res.status(201).json(novoLog);
    } catch (error) {
        console.error("Erro ao criar log de auditoria:", error);
        return res.status(500).json({ error: 'Erro ao criar log de auditoria', details: error.message });
    }
};

// 🔹 Buscar todos os logs de auditoria com filtros dinâmicos
exports.getAllAuditLogs = async (req, res) => {
    try {
        const filtros = {};

        if (req.query.tabela_alvo) {
            filtros.tabela_alvo = { [Op.iLike]: `%${req.query.tabela_alvo}%` };
        }

        if (req.query.alterado_por) {
            filtros.alterado_por = req.query.alterado_por;
        }

        if (req.query.inicio && req.query.fim) {
            filtros.criado_em = { [Op.between]: [req.query.inicio, req.query.fim] };
        }

        const logs = await AuditLog.findAll({ where: filtros });

        res.json(logs);
    } catch (error) {
        console.error("Erro ao buscar logs de auditoria:", error);
        res.status(500).json({ error: 'Erro ao buscar logs de auditoria', details: error.message });
    }
};

// 🔹 Buscar um log de auditoria por ID
exports.getAuditLogById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const log = await AuditLog.findByPk(id);
        if (!log) {
            return res.status(404).json({ error: 'Log não encontrado' });
        }

        res.json(log);
    } catch (error) {
        console.error("Erro ao buscar log de auditoria:", error);
        res.status(500).json({ error: 'Erro ao buscar log de auditoria', details: error.message });
    }
};

// 🔹 Deletar um log de auditoria
exports.deleteAuditLog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const log = await AuditLog.findByPk(id);
        if (!log) {
            return res.status(404).json({ error: 'Log não encontrado' });
        }

        await log.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar log de auditoria:", error);
        res.status(500).json({ error: 'Erro ao deletar log de auditoria', details: error.message });
    }
};
