const { Pessoa, PessoaFisica } = require('../models');

exports.create = async (req, res) => {
    try {
        const { nome, email, senha_hash, telefone, endereco, cpf, data_nascimento } = req.body;
        const pessoa = await Pessoa.create({ nome, email, senha_hash, telefone, endereco, tipo_pessoa: 'fisica' });
        const pessoaFisica = await PessoaFisica.create({ id: pessoa.id, cpf, data_nascimento });
        res.status(201).json({ ...pessoa.toJSON(), ...pessoaFisica.toJSON() });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar Pessoa Física', details: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const pessoasFisicas = await PessoaFisica.findAll({ include: { model: Pessoa, as: 'pessoa' } });
        res.json(pessoasFisicas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Pessoas Físicas' });
    }
};

exports.getById = async (req, res) => {
    try {
        const pessoaFisica = await PessoaFisica.findByPk(req.params.id, { include: { model: Pessoa, as: 'pessoa' } });
        if (pessoaFisica) res.json(pessoaFisica);
        else res.status(404).json({ error: 'Pessoa Física não encontrada' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Pessoa Física' });
    }
};

exports.update = async (req, res) => {
    try {
        const { nome, email, senha_hash, telefone, endereco, cpf, data_nascimento } = req.body;
        const pessoaFisica = await PessoaFisica.findByPk(req.params.id);
        if (!pessoaFisica) return res.status(404).json({ error: 'Pessoa Física não encontrada' });
        await pessoaFisica.pessoa.update({ nome, email, senha_hash, telefone, endereco });
        await pessoaFisica.update({ cpf, data_nascimento });
        res.json({ ...pessoaFisica.pessoa.toJSON(), ...pessoaFisica.toJSON() });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar Pessoa Física' });
    }
};

exports.delete = async (req, res) => {
    try {
        const pessoaFisica = await PessoaFisica.findByPk(req.params.id);
        if (!pessoaFisica) return res.status(404).json({ error: 'Pessoa Física não encontrada' });
        await pessoaFisica.pessoa.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar Pessoa Física' });
    }
};