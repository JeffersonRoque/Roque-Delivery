const { Pessoa } = require('../models'); // Importando corretamente do index.js

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
        console.log("Recebendo requisição para criar pessoa:", req.body); // Debug

        const { nome, email, senha_hash, tipo_pessoa, telefone, endereco } = req.body;

        if (!nome || !email || !senha_hash || !tipo_pessoa || !telefone || !endereco) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const novaPessoa = await Pessoa.create({ nome, email, senha_hash, tipo_pessoa, telefone, endereco });

        return res.status(201).json(novaPessoa);
    } catch (error) {
        console.error("Erro ao criar pessoa:", error);
        return res.status(500).json({ error: 'Erro ao criar pessoa', details: error.message });
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

console.log("Modelo Pessoa carregado:", Pessoa);
