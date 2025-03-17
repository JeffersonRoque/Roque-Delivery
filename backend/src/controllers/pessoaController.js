const { Pessoa } = require('../models'); // Importando corretamente do index.js
const { Op } = require('sequelize'); // Operadores para consultas

// 🔹 Criar uma nova pessoa
exports.createPessoa = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar pessoa:", req.body); // Debug

        const { nome, email, senha_hash, tipo_pessoa, telefone, endereco } = req.body;

        if (!nome || !email || !senha_hash || !tipo_pessoa || !telefone || !endereco) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Verificar se já existe uma pessoa com o mesmo e-mail ou telefone
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

// 🔹 Busca todas as pessoas
exports.getAllPessoas = async (req, res) => {
    try {
        const pessoas = await Pessoa.findAll();
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

        // Verifica se o ID é um UUID válido
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

        // Verifica se o ID é um UUID válido
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pessoa = await Pessoa.findByPk(id);
        if (!pessoa) {
            return res.status(404).json({ error: 'Pessoa não encontrada' });
        }

        // Verifica se o novo email ou telefone já pertence a outra pessoa
        if (email || telefone) {
            const existeOutraPessoa = await Pessoa.findOne({
                where: {
                    [Op.or]: [{ email }, { telefone }],
                    id: { [Op.ne]: id } // Garante que não seja a própria pessoa
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

        // Verifica se o ID é um UUID válido
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

console.log("Modelo Pessoa carregado:", Pessoa);