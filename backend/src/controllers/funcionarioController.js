const { Funcionario, PessoaFisica, Pessoa } = require('../models');
const { Op } = require('sequelize'); // Operadores para consultas dinâmicas

// 🔹 Criar um novo funcionário
exports.createFuncionario = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar funcionário:", req.body);

        const { pessoa_id, empregador_id, cargo } = req.body;

        if (!pessoa_id || !empregador_id || !cargo) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Verificar se a pessoa física existe
        const pessoaFisica = await PessoaFisica.findByPk(pessoa_id);
        if (!pessoaFisica) {
            return res.status(404).json({ error: 'Pessoa Física não encontrada' });
        }

        // Verificar se o empregador existe
        const empregador = await Pessoa.findByPk(empregador_id);
        if (!empregador) {
            return res.status(404).json({ error: 'Empregador não encontrado' });
        }

        const novoFuncionario = await Funcionario.create({ id: pessoa_id, empregador_id, cargo });

        return res.status(201).json(novoFuncionario);
    } catch (error) {
        console.error("Erro ao criar funcionário:", error);
        return res.status(500).json({ error: 'Erro ao criar funcionário', details: error.message });
    }
};

// 🔹 Buscar Funcionários com Filtros Dinâmicos
exports.getFuncionarios = async (req, res) => {
    try {
        const { cargo, empregador_id, nome, data_inicio, data_fim } = req.query;

        let where = {};
        if (cargo) where.cargo = { [Op.iLike]: `%${cargo}%` };
        if (empregador_id) where.empregador_id = empregador_id;
        if (data_inicio && data_fim) {
            where.criado_em = { [Op.between]: [new Date(data_inicio), new Date(data_fim)] };
        }

        const funcionarios = await Funcionario.findAll({
            where,
            include: {
                model: PessoaFisica,
                as: 'pessoaFisica',
                where: nome ? { nome: { [Op.iLike]: `%${nome}%` } } : undefined
            }
        });

        res.json(funcionarios);
    } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
        res.status(500).json({ error: 'Erro ao buscar funcionários', details: error.message });
    }
};

// 🔹 Buscar um funcionário por ID
exports.getFuncionarioById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const funcionario = await Funcionario.findByPk(id, {
            include: { model: PessoaFisica, as: 'pessoaFisica' }
        });

        if (!funcionario) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        res.json(funcionario);
    } catch (error) {
        console.error("Erro ao buscar funcionário:", error);
        res.status(500).json({ error: 'Erro ao buscar funcionário', details: error.message });
    }
};

// 🔹 Atualizar um funcionário
exports.updateFuncionario = async (req, res) => {
    try {
        const { id } = req.params;
        const { cargo } = req.body;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const funcionario = await Funcionario.findByPk(id);
        if (!funcionario) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        await funcionario.update({ cargo });
        res.json(funcionario);
    } catch (error) {
        console.error("Erro ao atualizar funcionário:", error);
        res.status(500).json({ error: 'Erro ao atualizar funcionário', details: error.message });
    }
};

// 🔹 Deletar um funcionário
exports.deleteFuncionario = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const funcionario = await Funcionario.findByPk(id);
        if (!funcionario) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        await funcionario.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar funcionário:", error);
        res.status(500).json({ error: 'Erro ao deletar funcionário', details: error.message });
    }
};
