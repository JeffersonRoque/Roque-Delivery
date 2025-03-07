const Pessoa = require('../models/pessoa');

exports.getAllPessoas = async (req, res) => {
    try {
        const pessoas = await Pessoa.findAll();
        res.json(pessoas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar pessoas' });
    }
};

exports.createPessoa = async (req, res) => {
    try {
        const pessoa = await Pessoa.create(req.body);
        res.status(201).json(pessoa);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar pessoa' });
    }
};

exports.getPessoaById = async (req, res) => {
    try {
        const pessoa = await Pessoa.findByPk(req.params.id);
        if (pessoa) {
            res.json(pessoa);
        } else {
            res.status(404).json({ error: 'Pessoa não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar pessoa' });
    }
};

exports.updatePessoa = async (req, res) => {
    try {
        const pessoa = await Pessoa.findByPk(req.params.id);
        if (pessoa) {
            await pessoa.update(req.body);
            res.json(pessoa);
        } else {
            res.status(404).json({ error: 'Pessoa não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar pessoa' });
    }
};

exports.deletePessoa = async (req, res) => {
    try {
        const pessoa = await Pessoa.findByPk(req.params.id);
        if (pessoa) {
            await pessoa.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Pessoa não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar pessoa' });
    }
};
