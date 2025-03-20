const { Pessoa, PessoaFisica } = require('../models');
const { Op } = require('sequelize'); // Operadores para consultas dinâmicas

// 🔹 Criar uma nova Pessoa Física
exports.create = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar Pessoa Física:", req.body);

        const { nome, email, senha_hash, telefone, endereco, cpf_hash, data_nascimento } = req.body;

        if (!nome || !email || !senha_hash || !telefone || !endereco || !cpf_hash || !data_nascimento) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Verificar se já existe uma pessoa com mesmo e-mail ou telefone
        const pessoaExistente = await Pessoa.findOne({ where: { [Op.or]: [{ email }, { telefone }] } });
        if (pessoaExistente) return res.status(400).json({ error: 'E-mail ou telefone já cadastrado' });

        // Criar Pessoa e Pessoa Física
        const pessoa = await Pessoa.create({ nome, email, senha_hash, telefone, endereco, tipo_pessoa: 'fisica' });
        const pessoaFisica = await PessoaFisica.create({ id: pessoa.id, cpf_hash, data_nascimento });

        res.status(201).json({ ...pessoa.toJSON(), ...pessoaFisica.toJSON() });
    } catch (error) {
        console.error("Erro ao criar Pessoa Física:", error);
        res.status(500).json({ error: 'Erro ao criar Pessoa Física', details: error.message });
    }
};

// 🔹 Buscar Pessoas Físicas com Filtros Dinâmicos
exports.getAll = async (req, res) => {
    try {
        const { nome, email, telefone, cpf_hash, data_nascimento, limite, ordenacao } = req.query;

        let wherePessoa = {};
        let wherePessoaFisica = {};

        if (nome) wherePessoa.nome = { [Op.iLike]: `%${nome}%` };
        if (email) wherePessoa.email = { [Op.iLike]: `%${email}%` };
        if (telefone) wherePessoa.telefone = telefone;
        if (cpf_hash) wherePessoaFisica.cpf = cpf_hash;
        if (data_nascimento) wherePessoaFisica.data_nascimento = data_nascimento;

        const pessoasFisicas = await PessoaFisica.findAll({
            where: wherePessoaFisica,
            include: {
                model: Pessoa,
                as: 'pessoa',
                where: wherePessoa
            },
            order: [['id', ordenacao === 'asc' ? 'ASC' : 'DESC']],
            limit: limite ? parseInt(limite) : null
        });

        res.json(pessoasFisicas);
    } catch (error) {
        console.error("Erro ao buscar Pessoas Físicas:", error);
        res.status(500).json({ error: 'Erro ao buscar Pessoas Físicas', details: error.message });
    }
};

// 🔹 Buscar uma Pessoa Física por ID
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pessoaFisica = await PessoaFisica.findByPk(id, { include: { model: Pessoa, as: 'pessoa' } });

        if (!pessoaFisica) {
            return res.status(404).json({ error: 'Pessoa Física não encontrada' });
        }

        res.json(pessoaFisica);
    } catch (error) {
        console.error("Erro ao buscar Pessoa Física:", error);
        res.status(500).json({ error: 'Erro ao buscar Pessoa Física', details: error.message });
    }
};

// 🔹 Atualizar uma Pessoa Física
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha_hash, telefone, endereco, cpf_hash, data_nascimento } = req.body;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pessoaFisica = await PessoaFisica.findByPk(id, { include: { model: Pessoa, as: 'pessoa' } });
        if (!pessoaFisica) {
            return res.status(404).json({ error: 'Pessoa Física não encontrada' });
        }

        // Verificar se o novo e-mail ou telefone já pertence a outra pessoa
        if (email || telefone) {
            const pessoaExistente = await Pessoa.findOne({
                where: {
                    [Op.or]: [{ email }, { telefone }],
                    id: { [Op.ne]: id }
                }
            });

            if (pessoaExistente) return res.status(400).json({ error: 'E-mail ou telefone já está em uso por outra pessoa' });
        }

        // Atualizar os dados
        await pessoaFisica.pessoa.update({ nome, email, senha_hash, telefone, endereco });
        await pessoaFisica.update({ cpf_hash, data_nascimento });

        res.json({ ...pessoaFisica.pessoa.toJSON(), ...pessoaFisica.toJSON() });
    } catch (error) {
        console.error("Erro ao atualizar Pessoa Física:", error);
        res.status(500).json({ error: 'Erro ao atualizar Pessoa Física', details: error.message });
    }
};

// 🔹 Deletar uma Pessoa Física
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pessoaFisica = await PessoaFisica.findByPk(id, { include: { model: Pessoa, as: 'pessoa' } });
        if (!pessoaFisica) {
            return res.status(404).json({ error: 'Pessoa Física não encontrada' });
        }

        await pessoaFisica.pessoa.destroy();

        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar Pessoa Física:", error);
        res.status(500).json({ error: 'Erro ao deletar Pessoa Física', details: error.message });
    }
};
