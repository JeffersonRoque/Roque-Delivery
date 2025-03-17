const { Motorista, Funcionario } = require('../models');
const { Op } = require('sequelize'); // Operadores para filtros dinâmicos

// 🔹 Criar um novo motorista
exports.createMotorista = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar motorista:", req.body);

        const { id, tipo_veiculo, placa_veiculo } = req.body;

        if (!id || !tipo_veiculo || !placa_veiculo) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Verificar se o funcionário existe antes de criar o motorista
        const funcionario = await Funcionario.findByPk(id);
        if (!funcionario) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        const novoMotorista = await Motorista.create({ id, tipo_veiculo, placa_veiculo });
        return res.status(201).json(novoMotorista);
    } catch (error) {
        console.error("Erro ao criar motorista:", error);
        return res.status(500).json({ error: 'Erro ao criar motorista', details: error.message });
    }
};

// 🔹 Buscar Motoristas com Filtros Dinâmicos
exports.getMotoristas = async (req, res) => {
    try {
        const { tipo_veiculo, placa_veiculo } = req.query;

        let where = {};
        if (tipo_veiculo) where.tipo_veiculo = { [Op.iLike]: `%${tipo_veiculo}%` };
        if (placa_veiculo) where.placa_veiculo = { [Op.iLike]: `%${placa_veiculo}%` };

        const motoristas = await Motorista.findAll({
            where,
            include: { model: Funcionario, as: 'funcionario' }
        });

        res.json(motoristas);
    } catch (error) {
        console.error("Erro ao buscar motoristas:", error);
        res.status(500).json({ error: 'Erro ao buscar motoristas', details: error.message });
    }
};

// 🔹 Buscar um motorista por ID
exports.getMotoristaById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const motorista = await Motorista.findByPk(id, {
            include: { model: Funcionario, as: 'funcionario' }
        });

        if (!motorista) {
            return res.status(404).json({ error: 'Motorista não encontrado' });
        }

        res.json(motorista);
    } catch (error) {
        console.error("Erro ao buscar motorista:", error);
        res.status(500).json({ error: 'Erro ao buscar motorista', details: error.message });
    }
};

// 🔹 Atualizar um motorista
exports.updateMotorista = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_veiculo, placa_veiculo } = req.body;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const motorista = await Motorista.findByPk(id);
        if (!motorista) {
            return res.status(404).json({ error: 'Motorista não encontrado' });
        }

        await motorista.update({ tipo_veiculo, placa_veiculo });
        res.json(motorista);
    } catch (error) {
        console.error("Erro ao atualizar motorista:", error);
        res.status(500).json({ error: 'Erro ao atualizar motorista', details: error.message });
    }
};

// 🔹 Deletar um motorista
exports.deleteMotorista = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const motorista = await Motorista.findByPk(id);
        if (!motorista) {
            return res.status(404).json({ error: 'Motorista não encontrado' });
        }

        await motorista.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar motorista:", error);
        res.status(500).json({ error: 'Erro ao deletar motorista', details: error.message });
    }
};