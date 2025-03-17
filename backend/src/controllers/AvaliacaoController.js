const { Avaliacao, Pessoa, Motorista } = require('../models'); // Importando os models corretamente
const { Op } = require('sequelize'); // Operadores para consultas

// 🔹 Criar uma nova avaliação
exports.createAvaliacao = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar avaliação:", req.body); // Debug

        const { pessoa_id, motorista_id, nota, comentario } = req.body;

        if (!pessoa_id || !motorista_id || !nota) {
            return res.status(400).json({ error: 'Pessoa, Motorista e Nota são obrigatórios' });
        }

        if (nota < 1 || nota > 5) {
            return res.status(400).json({ error: 'A nota deve estar entre 1 e 5' });
        }

        const novaAvaliacao = await Avaliacao.create({ pessoa_id, motorista_id, nota, comentario });

        return res.status(201).json(novaAvaliacao);
    } catch (error) {
        console.error("Erro ao criar avaliação:", error);
        return res.status(500).json({ error: 'Erro ao criar avaliação', details: error.message });
    }
};

// 🔹 Buscar todas as avaliações com filtros dinâmicos
exports.getAllAvaliacoes = async (req, res) => {
    try {
        const { pessoa_id, motorista_id, nota_min, nota_max } = req.query;
        const filters = {};

        if (pessoa_id) filters.pessoa_id = pessoa_id;
        if (motorista_id) filters.motorista_id = motorista_id;
        if (nota_min) filters.nota = { [Op.gte]: nota_min };
        if (nota_max) filters.nota = { ...filters.nota, [Op.lte]: nota_max };

        const avaliacoes = await Avaliacao.findAll({
            where: filters,
            include: [
                { model: Pessoa, as: 'pessoa' },
                { model: Motorista, as: 'motorista' }
            ]
        });
        res.json(avaliacoes);
    } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
        res.status(500).json({ error: 'Erro ao buscar avaliações', details: error.message });
    }
};

// 🔹 Buscar uma avaliação por ID
exports.getAvaliacaoById = async (req, res) => {
    try {
        const { id } = req.params;

        const avaliacao = await Avaliacao.findByPk(id, {
            include: [
                { model: Pessoa, as: 'pessoa' },
                { model: Motorista, as: 'motorista' }
            ]
        });

        if (!avaliacao) {
            return res.status(404).json({ error: 'Avaliação não encontrada' });
        }

        res.json(avaliacao);
    } catch (error) {
        console.error("Erro ao buscar avaliação:", error);
        res.status(500).json({ error: 'Erro ao buscar avaliação', details: error.message });
    }
};

// 🔹 Atualizar uma avaliação
exports.updateAvaliacao = async (req, res) => {
    try {
        const { id } = req.params;
        const { nota, comentario } = req.body;

        const avaliacao = await Avaliacao.findByPk(id);

        if (!avaliacao) {
            return res.status(404).json({ error: 'Avaliação não encontrada' });
        }

        if (nota && (nota < 1 || nota > 5)) {
            return res.status(400).json({ error: 'A nota deve estar entre 1 e 5' });
        }

        await avaliacao.update({ nota, comentario });
        res.json(avaliacao);
    } catch (error) {
        console.error("Erro ao atualizar avaliação:", error);
        res.status(500).json({ error: 'Erro ao atualizar avaliação', details: error.message });
    }
};

// 🔹 Deletar uma avaliação
exports.deleteAvaliacao = async (req, res) => {
    try {
        const { id } = req.params;

        const avaliacao = await Avaliacao.findByPk(id);
        if (!avaliacao) {
            return res.status(404).json({ error: 'Avaliação não encontrada' });
        }

        await avaliacao.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar avaliação:", error);
        res.status(500).json({ error: 'Erro ao deletar avaliação', details: error.message });
    }
};
