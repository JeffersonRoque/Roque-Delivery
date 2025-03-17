const { Relatorio } = require('../models');
const { Op } = require('sequelize'); // Operadores para consultas

// 🔹 Criar um novo relatório
exports.createRelatorio = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar relatório:", req.body);

        const { tipo_relatorio, descricao } = req.body;

        if (!tipo_relatorio || !descricao) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const novoRelatorio = await Relatorio.create({ tipo_relatorio, descricao });

        return res.status(201).json(novoRelatorio);
    } catch (error) {
        console.error("Erro ao criar relatório:", error);
        return res.status(500).json({ error: 'Erro ao criar relatório', details: error.message });
    }
};

// 🔹 Buscar todos os relatórios com filtros dinâmicos
exports.getAllRelatorios = async (req, res) => {
    try {
        const filtros = {};

        if (req.query.tipo_relatorio) {
            filtros.tipo_relatorio = { [Op.iLike]: `%${req.query.tipo_relatorio}%` };
        }

        if (req.query.inicio && req.query.fim) {
            filtros.gerado_em = { [Op.between]: [req.query.inicio, req.query.fim] };
        }

        const relatorios = await Relatorio.findAll({ where: filtros });

        res.json(relatorios);
    } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
        res.status(500).json({ error: 'Erro ao buscar relatórios', details: error.message });
    }
};

// 🔹 Buscar um relatório por ID
exports.getRelatorioById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const relatorio = await Relatorio.findByPk(id);
        if (!relatorio) {
            return res.status(404).json({ error: 'Relatório não encontrado' });
        }

        res.json(relatorio);
    } catch (error) {
        console.error("Erro ao buscar relatório:", error);
        res.status(500).json({ error: 'Erro ao buscar relatório', details: error.message });
    }
};

// 🔹 Atualizar um relatório
exports.updateRelatorio = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_relatorio, descricao } = req.body;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const relatorio = await Relatorio.findByPk(id);
        if (!relatorio) {
            return res.status(404).json({ error: 'Relatório não encontrado' });
        }

        await relatorio.update({ tipo_relatorio, descricao });
        res.json(relatorio);
    } catch (error) {
        console.error("Erro ao atualizar relatório:", error);
        res.status(500).json({ error: 'Erro ao atualizar relatório', details: error.message });
    }
};

// 🔹 Deletar um relatório
exports.deleteRelatorio = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const relatorio = await Relatorio.findByPk(id);
        if (!relatorio) {
            return res.status(404).json({ error: 'Relatório não encontrado' });
        }

        await relatorio.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar relatório:", error);
        res.status(500).json({ error: 'Erro ao deletar relatório', details: error.message });
    }
};
