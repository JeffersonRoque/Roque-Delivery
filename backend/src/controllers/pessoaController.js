const { Pessoa } = require('../models');
const { Op } = require('sequelize'); // Operadores para consultas dinâmicas

// 🔹 Criar uma nova pessoa
exports.createPessoa = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar pessoa:", req.body);

        const { nome, email, senha_hash, tipo_pessoa, telefone, endereco } = req.body;

        if (!nome || !email || !senha_hash || !tipo_pessoa || !telefone || !endereco) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const pessoaExistente = await Pessoa.findOne({
            where: {
                [Op.or]: [{ email }, { telefone }]
            }
        });

        if (pessoaExistente) {
            return res.status(400).json({ error: 'E-mail ou telefone já cadastrado' });
        }

        const novaPessoa = await Pessoa.create({ nome, email, senha_hash, tipo_pessoa, telefone, endereco });
        return res.status(201).json(novaPessoa);
    } catch (error) {
        console.error("Erro ao criar pessoa:", error);
        return res.status(500).json({ error: 'Erro ao criar pessoa', details: error.message });
    }
};

// 🔹 Buscar Pessoas com Filtros Dinâmicos
exports.getPessoas = async (req, res) => {
    try {
        const { nome, email, tipo_pessoa, telefone, endereco, limite, ordenacao } = req.query;

        let where = {};
        if (nome) where.nome = { [Op.iLike]: `%${nome}%` };
        if (email) where.email = { [Op.iLike]: `%${email}%` };
        if (tipo_pessoa) where.tipo_pessoa = tipo_pessoa;
        if (telefone) where.telefone = telefone;
        if (endereco) where.endereco = { [Op.iLike]: `%${endereco}%` };

        const pessoas = await Pessoa.findAll({
            where,
            order: [['criado_em', ordenacao === 'asc' ? 'ASC' : 'DESC']],
            limit: limite ? parseInt(limite) : null
        });

        res.json(pessoas);
    } catch (error) {
        console.error("Erro ao buscar pessoas:", error);
        res.status(500).json({ error: 'Erro ao buscar pessoas', details: error.message });
    }
};

// 🔹 Buscar uma pessoa por ID
exports.getPessoaById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pessoa = await Pessoa.findByPk(id);
        if (!pessoa) {
            return res.status(404).json({ error: 'Pessoa não encontrada' });
        }
        res.json(pessoa);
    } catch (error) {
        console.error("Erro ao buscar pessoa:", error);
        res.status(500).json({ error: 'Erro ao buscar pessoa', details: error.message });
    }
};

// 🔹 Atualizar uma pessoa
exports.updatePessoa = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, telefone } = req.body;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pessoa = await Pessoa.findByPk(id);
        if (!pessoa) {
            return res.status(404).json({ error: 'Pessoa não encontrada' });
        }

        if (email || telefone) {
            const existeOutraPessoa = await Pessoa.findOne({
                where: {
                    [Op.or]: [{ email }, { telefone }],
                    id: { [Op.ne]: id }
                }
            });

            if (existeOutraPessoa) {
                return res.status(400).json({ error: 'E-mail ou telefone já está em uso por outra pessoa' });
            }
        }

        await pessoa.update(req.body);
        res.json(pessoa);
    } catch (error) {
        console.error("Erro ao atualizar pessoa:", error);
        res.status(500).json({ error: 'Erro ao atualizar pessoa', details: error.message });
    }
};

// 🔹 Deletar uma pessoa
exports.deletePessoa = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pessoa = await Pessoa.findByPk(id);
        if (!pessoa) {
            return res.status(404).json({ error: 'Pessoa não encontrada' });
        }

        await pessoa.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar pessoa:", error);
        res.status(500).json({ error: 'Erro ao deletar pessoa', details: error.message });
    }
};
