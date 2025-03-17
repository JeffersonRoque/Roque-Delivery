const { NotaFiscal, Pedido, Pessoa } = require('../models');
const { Op } = require('sequelize'); // Operadores para consultas

// 🔹 Criar uma nova Nota Fiscal
exports.createNotaFiscal = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar nota fiscal:", req.body);

        const { pedido_id, emissor_id, numero_nota, status } = req.body;

        if (!pedido_id || !emissor_id || !numero_nota) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Verifica se já existe uma nota fiscal para esse pedido
        const notaExistente = await NotaFiscal.findOne({ where: { pedido_id } });

        if (notaExistente) {
            return res.status(400).json({ error: 'Esse pedido já possui uma Nota Fiscal' });
        }

        const novaNotaFiscal = await NotaFiscal.create({ pedido_id, emissor_id, numero_nota, status });

        return res.status(201).json(novaNotaFiscal);
    } catch (error) {
        console.error("Erro ao criar nota fiscal:", error);
        return res.status(500).json({ error: 'Erro ao criar nota fiscal', details: error.message });
    }
};

// 🔹 Buscar todas as Notas Fiscais
exports.getAllNotasFiscais = async (req, res) => {
    try {
        const notasFiscais = await NotaFiscal.findAll({
            include: [
                { model: Pedido, as: 'pedido' },
                { model: Pessoa, as: 'emissor' }
            ]
        });
        res.json(notasFiscais);
    } catch (error) {
        console.error("Erro ao buscar notas fiscais:", error);
        res.status(500).json({ error: 'Erro ao buscar notas fiscais', details: error.message });
    }
};

// 🔹 Buscar uma Nota Fiscal por ID
exports.getNotaFiscalById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const notaFiscal = await NotaFiscal.findByPk(id, {
            include: [
                { model: Pedido, as: 'pedido' },
                { model: Pessoa, as: 'emissor' }
            ]
        });

        if (!notaFiscal) {
            return res.status(404).json({ error: 'Nota Fiscal não encontrada' });
        }

        res.json(notaFiscal);
    } catch (error) {
        console.error("Erro ao buscar nota fiscal:", error);
        res.status(500).json({ error: 'Erro ao buscar nota fiscal', details: error.message });
    }
};

// 🔹 Buscar Notas Fiscais por Pedido
exports.getNotaFiscalByPedido = async (req, res) => {
    try {
        const { pedido_id } = req.params;

        if (!pedido_id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID de pedido inválido' });
        }

        const notaFiscal = await NotaFiscal.findOne({
            where: { pedido_id },
            include: [
                { model: Pedido, as: 'pedido' },
                { model: Pessoa, as: 'emissor' }
            ]
        });

        if (!notaFiscal) {
            return res.status(404).json({ error: 'Nota Fiscal não encontrada para esse pedido' });
        }

        res.json(notaFiscal);
    } catch (error) {
        console.error("Erro ao buscar nota fiscal por pedido:", error);
        res.status(500).json({ error: 'Erro ao buscar nota fiscal', details: error.message });
    }
};

// 🔹 Atualizar uma Nota Fiscal
exports.updateNotaFiscal = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const notaFiscal = await NotaFiscal.findByPk(id);

        if (!notaFiscal) {
            return res.status(404).json({ error: 'Nota Fiscal não encontrada' });
        }

        await notaFiscal.update({ status });
        res.json(notaFiscal);
    } catch (error) {
        console.error("Erro ao atualizar nota fiscal:", error);
        res.status(500).json({ error: 'Erro ao atualizar nota fiscal', details: error.message });
    }
};

// 🔹 Deletar uma Nota Fiscal
exports.deleteNotaFiscal = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const notaFiscal = await NotaFiscal.findByPk(id);
        if (!notaFiscal) {
            return res.status(404).json({ error: 'Nota Fiscal não encontrada' });
        }

        await notaFiscal.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar nota fiscal:", error);
        res.status(500).json({ error: 'Erro ao deletar nota fiscal', details: error.message });
    }
};