const { Entrega, Pedido, Motorista } = require('../models'); // Importando corretamente do index.js
const { Op } = require('sequelize'); // Operadores para consultas

// 🔹 Criar uma nova entrega
exports.createEntrega = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar entrega:", req.body); // Debug

        const { pedido_id, motorista_id, status } = req.body;

        if (!pedido_id || !motorista_id || !status) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const novaEntrega = await Entrega.create({ pedido_id, motorista_id, status });

        return res.status(201).json(novaEntrega);
    } catch (error) {
        console.error("Erro ao criar entrega:", error);
        return res.status(500).json({ error: 'Erro ao criar entrega', details: error.message });
    }
};

// 🔹 Buscar todas as entregas
exports.getAllEntregas = async (req, res) => {
    try {
        const entregas = await Entrega.findAll({
            include: [
                { model: Pedido, as: 'pedido' },
                { model: Motorista, as: 'motorista' }
            ]
        });
        res.json(entregas);
    } catch (error) {
        console.error("Erro ao buscar entregas:", error);
        res.status(500).json({ error: 'Erro ao buscar entregas', details: error.message });
    }
};

// 🔹 Buscar uma entrega por ID
exports.getEntregaById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const entrega = await Entrega.findByPk(id, {
            include: [
                { model: Pedido, as: 'pedido' },
                { model: Motorista, as: 'motorista' }
            ]
        });

        if (!entrega) {
            return res.status(404).json({ error: 'Entrega não encontrada' });
        }

        res.json(entrega);
    } catch (error) {
        console.error("Erro ao buscar entrega:", error);
        res.status(500).json({ error: 'Erro ao buscar entrega', details: error.message });
    }
};

// 🔹 Buscar entregas por status
exports.getEntregasByStatus = async (req, res) => {
    try {
        const { status } = req.params;

        const entregas = await Entrega.findAll({
            where: { status },
            include: [
                { model: Pedido, as: 'pedido' },
                { model: Motorista, as: 'motorista' }
            ]
        });

        res.json(entregas);
    } catch (error) {
        console.error("Erro ao buscar entregas por status:", error);
        res.status(500).json({ error: 'Erro ao buscar entregas por status', details: error.message });
    }
};

// 🔹 Buscar todas as entregas de um motorista específico
exports.getEntregasByMotorista = async (req, res) => {
    try {
        const { motorista_id } = req.params;

        const entregas = await Entrega.findAll({
            where: { motorista_id },
            include: [{ model: Pedido, as: 'pedido' }]
        });

        res.json(entregas);
    } catch (error) {
        console.error("Erro ao buscar entregas do motorista:", error);
        res.status(500).json({ error: 'Erro ao buscar entregas do motorista', details: error.message });
    }
};

// 🔹 Atualizar uma entrega
exports.updateEntrega = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const entrega = await Entrega.findByPk(id);
        if (!entrega) {
            return res.status(404).json({ error: 'Entrega não encontrada' });
        }

        await entrega.update({ status });

        res.json(entrega);
    } catch (error) {
        console.error("Erro ao atualizar entrega:", error);
        res.status(500).json({ error: 'Erro ao atualizar entrega', details: error.message });
    }
};

// 🔹 Deletar uma entrega
exports.deleteEntrega = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const entrega = await Entrega.findByPk(id);
        if (!entrega) {
            return res.status(404).json({ error: 'Entrega não encontrada' });
        }

        await entrega.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar entrega:", error);
        res.status(500).json({ error: 'Erro ao deletar entrega', details: error.message });
    }
};

console.log("Modelo Entrega carregado:", Entrega);
