const { Localizacao, Pessoa, Motorista } = require('../models');
const { Op } = require('sequelize'); // Operadores para consultas

// 🔹 Criar uma nova localização
exports.createLocalizacao = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar localização:", req.body);

        const { pessoa_id, motorista_id, latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude e Longitude são obrigatórias' });
        }

        const novaLocalizacao = await Localizacao.create({ pessoa_id, motorista_id, latitude, longitude });

        return res.status(201).json(novaLocalizacao);
    } catch (error) {
        console.error("Erro ao criar localização:", error);
        return res.status(500).json({ error: 'Erro ao criar localização', details: error.message });
    }
};

// 🔹 Buscar todas as localizações
exports.getAllLocalizacoes = async (req, res) => {
    try {
        const localizacoes = await Localizacao.findAll({
            include: [
                { model: Pessoa, as: 'pessoa' },
                { model: Motorista, as: 'motorista' }
            ]
        });
        res.json(localizacoes);
    } catch (error) {
        console.error("Erro ao buscar localizações:", error);
        res.status(500).json({ error: 'Erro ao buscar localizações', details: error.message });
    }
};

// 🔹 Buscar uma localização por ID
exports.getLocalizacaoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const localizacao = await Localizacao.findByPk(id, {
            include: [
                { model: Pessoa, as: 'pessoa' },
                { model: Motorista, as: 'motorista' }
            ]
        });

        if (!localizacao) {
            return res.status(404).json({ error: 'Localização não encontrada' });
        }

        res.json(localizacao);
    } catch (error) {
        console.error("Erro ao buscar localização:", error);
        res.status(500).json({ error: 'Erro ao buscar localização', details: error.message });
    }
};

// 🔹 Buscar todas as localizações de uma pessoa específica
exports.getLocalizacoesByPessoa = async (req, res) => {
    try {
        const { pessoa_id } = req.params;

        if (!pessoa_id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const localizacoes = await Localizacao.findAll({
            where: { pessoa_id },
            include: { model: Pessoa, as: 'pessoa' }
        });

        res.json(localizacoes);
    } catch (error) {
        console.error("Erro ao buscar localizações da pessoa:", error);
        res.status(500).json({ error: 'Erro ao buscar localizações', details: error.message });
    }
};

// 🔹 Buscar todas as localizações de um motorista específico
exports.getLocalizacoesByMotorista = async (req, res) => {
    try {
        const { motorista_id } = req.params;

        if (!motorista_id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const localizacoes = await Localizacao.findAll({
            where: { motorista_id },
            include: { model: Motorista, as: 'motorista' }
        });

        res.json(localizacoes);
    } catch (error) {
        console.error("Erro ao buscar localizações do motorista:", error);
        res.status(500).json({ error: 'Erro ao buscar localizações', details: error.message });
    }
};


// 🔹 Atualizar uma localização
exports.updateLocalizacao = async (req, res) => {
    try {
        const { id } = req.params;
        const { latitude, longitude } = req.body;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const localizacao = await Localizacao.findByPk(id);

        if (!localizacao) {
            return res.status(404).json({ error: 'Localização não encontrada' });
        }

        await localizacao.update({ latitude, longitude });
        res.json(localizacao);
    } catch (error) {
        console.error("Erro ao atualizar localização:", error);
        res.status(500).json({ error: 'Erro ao atualizar localização', details: error.message });
    }
};

// 🔹 Deletar uma localização
exports.deleteLocalizacao = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const localizacao = await Localizacao.findByPk(id);
        if (!localizacao) {
            return res.status(404).json({ error: 'Localização não encontrada' });
        }

        await localizacao.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar localização:", error);
        res.status(500).json({ error: 'Erro ao deletar localização', details: error.message });
    }
};
