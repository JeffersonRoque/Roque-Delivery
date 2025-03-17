const { Cashback, Pessoa } = require('../models');
const { Op } = require('sequelize'); // Operadores para consultas

// 🔹 Criar um novo saldo de Cashback para uma pessoa
exports.createCashback = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar cashback:", req.body);

        const { pessoa_id, valor_acumulado } = req.body;

        if (!pessoa_id) {
            return res.status(400).json({ error: 'O ID da pessoa é obrigatório' });
        }

        // Verificar se a pessoa existe
        const pessoa = await Pessoa.findByPk(pessoa_id);
        if (!pessoa) {
            return res.status(404).json({ error: 'Pessoa não encontrada' });
        }

        // Verificar se a pessoa já possui um cashback registrado
        const cashbackExistente = await Cashback.findOne({ where: { pessoa_id } });
        if (cashbackExistente) {
            return res.status(400).json({ error: 'Cashback já existe para esta pessoa' });
        }

        const novoCashback = await Cashback.create({ pessoa_id, valor_acumulado });

        return res.status(201).json(novoCashback);
    } catch (error) {
        console.error("Erro ao criar cashback:", error);
        return res.status(500).json({ error: 'Erro ao criar cashback', details: error.message });
    }
};

// 🔹 Buscar todos os registros de Cashback (com filtros opcionais)
exports.getAllCashbacks = async (req, res) => {
    try {
        const { minimo, maximo, inicio, fim, pessoa_id } = req.query;
        let whereClause = {};

        // Filtro: Cashback dentro de um intervalo de valores
        if (minimo || maximo) {
            whereClause.valor_acumulado = {};
            if (minimo) whereClause.valor_acumulado[Op.gte] = parseFloat(minimo);
            if (maximo) whereClause.valor_acumulado[Op.lte] = parseFloat(maximo);
        }

        // Filtro: Cashback atualizado entre datas específicas
        if (inicio && fim) {
            whereClause.atualizado_em = { [Op.between]: [new Date(inicio), new Date(fim)] };
        }

        // Filtro: Cashback de uma pessoa específica
        if (pessoa_id) {
            whereClause.pessoa_id = pessoa_id;
        }

        const cashbacks = await Cashback.findAll({
            where: whereClause,
            include: { model: Pessoa, as: 'pessoa' }
        });

        res.json(cashbacks);
    } catch (error) {
        console.error("Erro ao buscar cashbacks:", error);
        res.status(500).json({ error: 'Erro ao buscar cashbacks', details: error.message });
    }
};

// 🔹 Buscar Cashback por ID da pessoa
exports.getCashbackByPessoa = async (req, res) => {
    try {
        const { pessoa_id } = req.params;

        if (!pessoa_id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const cashback = await Cashback.findOne({
            where: { pessoa_id },
            include: { model: Pessoa, as: 'pessoa' }
        });

        if (!cashback) {
            return res.status(404).json({ error: 'Cashback não encontrado para esta pessoa' });
        }

        res.json(cashback);
    } catch (error) {
        console.error("Erro ao buscar cashback:", error);
        res.status(500).json({ error: 'Erro ao buscar cashback', details: error.message });
    }
};

// 🔹 Atualizar o valor do Cashback
exports.updateCashback = async (req, res) => {
    try {
        const { pessoa_id } = req.params;
        const { valor_acumulado } = req.body;

        if (!pessoa_id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const cashback = await Cashback.findOne({ where: { pessoa_id } });

        if (!cashback) {
            return res.status(404).json({ error: 'Cashback não encontrado' });
        }

        await cashback.update({ valor_acumulado, atualizado_em: new Date() });

        res.json(cashback);
    } catch (error) {
        console.error("Erro ao atualizar cashback:", error);
        res.status(500).json({ error: 'Erro ao atualizar cashback', details: error.message });
    }
};

// 🔹 Deletar um registro de Cashback
exports.deleteCashback = async (req, res) => {
    try {
        const { pessoa_id } = req.params;

        if (!pessoa_id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const cashback = await Cashback.findOne({ where: { pessoa_id } });

        if (!cashback) {
            return res.status(404).json({ error: 'Cashback não encontrado' });
        }

        await cashback.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar cashback:", error);
        res.status(500).json({ error: 'Erro ao deletar cashback', details: error.message });
    }
};
