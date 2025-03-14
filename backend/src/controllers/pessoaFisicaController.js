const { Pessoa, PessoaFisica } = require('../models');
const { Op } = require('sequelize');

// 🔹 Criar uma nova Pessoa Física
exports.create = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar Pessoa Física:", req.body); // Debug

        const { nome, email, senha_hash, telefone, endereco, cpf, data_nascimento } = req.body;

        if (!nome || !email || !senha_hash || !telefone || !endereco || !cpf || !data_nascimento) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Verificar se já existe uma pessoa com mesmo e-mail, telefone ou CPF
        const pessoaExistente = await Pessoa.findOne({
            where: {
                [Op.or]: [{ email }, { telefone }]
            }
        });

        if (pessoaExistente) {
            return res.status(400).json({ error: 'E-mail ou telefone já cadastrado' });
        }

        const cpfExistente = await PessoaFisica.findOne({ where: { cpf } });

        if (cpfExistente) {
            return res.status(400).json({ error: 'CPF já cadastrado' });
        }

        // Criar Pessoa e Pessoa Física
        const pessoa = await Pessoa.create({ nome, email, senha_hash, telefone, endereco, tipo_pessoa: 'fisica' });
        const pessoaFisica = await PessoaFisica.create({ id: pessoa.id, cpf, data_nascimento });

        res.status(201).json({ ...pessoa.toJSON(), ...pessoaFisica.toJSON() });
    } catch (error) {
        console.error("Erro ao criar Pessoa Física:", error);
        res.status(500).json({ error: 'Erro ao criar Pessoa Física', details: error.message });
    }
};

// 🔹 Buscar todas as Pessoas Físicas
exports.getAll = async (req, res) => {
    try {
        const pessoasFisicas = await PessoaFisica.findAll({ include: { model: Pessoa, as: 'pessoa' } });
        res.json(pessoasFisicas);
    } catch (error) {
        console.error("Erro ao buscar Pessoas Físicas:", error);
        res.status(500).json({ error: 'Erro ao buscar Pessoas Físicas' });
    }
};

// 🔹 Buscar uma Pessoa Física por ID
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar se o ID é um UUID válido
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
        res.status(500).json({ error: 'Erro ao buscar Pessoa Física' });
    }
};

// 🔹 Atualizar uma Pessoa Física
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha_hash, telefone, endereco, cpf, data_nascimento } = req.body;

        // Validar se o ID é um UUID válido
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        // Buscar a Pessoa Física e sua Pessoa relacionada em uma única consulta
        const pessoaFisica = await PessoaFisica.findByPk(id, { include: { model: Pessoa, as: 'pessoa' } });

        if (!pessoaFisica) {
            return res.status(404).json({ error: 'Pessoa Física não encontrada' });
        }

        // Verificar se o novo e-mail, telefone ou CPF já pertence a outra pessoa
        if (email || telefone) {
            const pessoaExistente = await Pessoa.findOne({
                where: {
                    [Op.or]: [{ email }, { telefone }],
                    id: { [Op.ne]: id } // Garante que não seja a própria pessoa
                }
            });

            if (pessoaExistente) {
                return res.status(400).json({ error: 'E-mail ou telefone já está em uso por outra pessoa' });
            }
        }

        if (cpf) {
            const cpfExistente = await PessoaFisica.findOne({
                where: {
                    cpf,
                    id: { [Op.ne]: id } // Garante que não seja a própria pessoa
                }
            });

            if (cpfExistente) {
                return res.status(400).json({ error: 'CPF já está em uso por outra pessoa' });
            }
        }

        // Atualizar os dados
        await pessoaFisica.pessoa.update({ nome, email, senha_hash, telefone, endereco });
        await pessoaFisica.update({ cpf, data_nascimento });

        res.json({ ...pessoaFisica.pessoa.toJSON(), ...pessoaFisica.toJSON() });
    } catch (error) {
        console.error("Erro ao atualizar Pessoa Física:", error);
        res.status(500).json({ error: 'Erro ao atualizar Pessoa Física' });
    }
};

// 🔹 Deletar uma Pessoa Física
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar se o ID é um UUID válido
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pessoaFisica = await PessoaFisica.findByPk(id, { include: { model: Pessoa, as: 'pessoa' } });

        if (!pessoaFisica) {
            return res.status(404).json({ error: 'Pessoa Física não encontrada' });
        }

        // Deleta primeiro a Pessoa associada
        await pessoaFisica.pessoa.destroy();

        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar Pessoa Física:", error);
        res.status(500).json({ error: 'Erro ao deletar Pessoa Física' });
    }
};