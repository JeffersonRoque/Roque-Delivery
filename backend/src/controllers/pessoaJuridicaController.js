const { Pessoa, PessoaJuridica } = require('../models');

exports.create = async (req, res) => {
    try {
        const { nome, email, senha_hash, telefone, endereco, cnpj, razao_social, nome_fantasia, inscricao_estadual, eh_empresa } = req.body;
        const pessoa = await Pessoa.create({ nome, email, senha_hash, telefone, endereco, tipo_pessoa: 'juridica' });
        const pessoaJuridica = await PessoaJuridica.create({ id: pessoa.id, cnpj, razao_social, nome_fantasia, inscricao_estadual, eh_empresa });
        res.status(201).json({ ...pessoa.toJSON(), ...pessoaJuridica.toJSON() });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar Pessoa Jurídica', details: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const pessoasJuridicas = await PessoaJuridica.findAll({ include: { model: Pessoa, as: 'pessoa' } });
        res.json(pessoasJuridicas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Pessoas Jurídicas' });
    }
};

exports.getById = async (req, res) => {
    try {
        const pessoaJuridica = await PessoaJuridica.findByPk(req.params.id, { include: { model: Pessoa, as: 'pessoa' } });
        if (pessoaJuridica) res.json(pessoaJuridica);
        else res.status(404).json({ error: 'Pessoa Jurídica não encontrada' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Pessoa Jurídica' });
    }
};

exports.update = async (req, res) => {
    try {
        const { nome, email, senha_hash, telefone, endereco, cnpj, razao_social, nome_fantasia, inscricao_estadual, eh_empresa } = req.body;
        const pessoaJuridica = await PessoaJuridica.findByPk(req.params.id);
        if (!pessoaJuridica) return res.status(404).json({ error: 'Pessoa Jurídica não encontrada' });
        await pessoaJuridica.pessoa.update({ nome, email, senha_hash, telefone, endereco });
        await pessoaJuridica.update({ cnpj, razao_social, nome_fantasia, inscricao_estadual, eh_empresa });
        res.json({ ...pessoaJuridica.pessoa.toJSON(), ...pessoaJuridica.toJSON() });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar Pessoa Jurídica' });
    }
};

exports.delete = async (req, res) => {
    try {
        const pessoaJuridica = await PessoaJuridica.findByPk(req.params.id);
        if (!pessoaJuridica) return res.status(404).json({ error: 'Pessoa Jurídica não encontrada' });
        await pessoaJuridica.pessoa.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar Pessoa Jurídica' });
    }
};