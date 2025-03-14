const { Pessoa, PessoaJuridica } = require('../models');
const { Op } = require('sequelize');

// 🔹 Criar uma nova Pessoa Jurídica
exports.create = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar Pessoa Jurídica:", req.body); // Debug

        const { nome, email, senha_hash, telefone, endereco, cnpj, razao_social, nome_fantasia, inscricao_estadual, eh_empresa } = req.body;

        if (!nome || !email || !senha_hash || !telefone || !endereco || !cnpj || !razao_social) {
            return res.status(400).json({ error: 'Nome, e-mail, senha, telefone, endereço, CNPJ e razão social são obrigatórios' });
        }

        // Verificar se já existe uma pessoa com mesmo e-mail, telefone ou CNPJ
        const pessoaExistente = await Pessoa.findOne({
            where: {
                [Op.or]: [{ email }, { telefone }]
            }
        });

        if (pessoaExistente) {
            return res.status(400).json({ error: 'E-mail ou telefone já cadastrado' });
        }

        const cnpjExistente = await PessoaJuridica.findOne({ where: { cnpj } });

        if (cnpjExistente) {
            return res.status(400).json({ error: 'CNPJ já cadastrado' });
        }

        // Criar Pessoa e Pessoa Jurídica
        const pessoa = await Pessoa.create({ nome, email, senha_hash, telefone, endereco, tipo_pessoa: 'juridica' });
        const pessoaJuridica = await PessoaJuridica.create({ id: pessoa.id, cnpj, razao_social, nome_fantasia, inscricao_estadual, eh_empresa });

        res.status(201).json({ ...pessoa.toJSON(), ...pessoaJuridica.toJSON() });
    } catch (error) {
        console.error("Erro ao criar Pessoa Jurídica:", error);
        res.status(500).json({ error: 'Erro ao criar Pessoa Jurídica', details: error.message });
    }
};

// 🔹 Buscar todas as Pessoas Jurídicas
exports.getAll = async (req, res) => {
    try {
        const pessoasJuridicas = await PessoaJuridica.findAll({ include: { model: Pessoa, as: 'pessoa' } });
        res.json(pessoasJuridicas);
    } catch (error) {
        console.error("Erro ao buscar Pessoas Jurídicas:", error);
        res.status(500).json({ error: 'Erro ao buscar Pessoas Jurídicas' });
    }
};

// 🔹 Buscar uma Pessoa Jurídica por ID
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar se o ID é um UUID válido
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pessoaJuridica = await PessoaJuridica.findByPk(id, { include: { model: Pessoa, as: 'pessoa' } });

        if (!pessoaJuridica) {
            return res.status(404).json({ error: 'Pessoa Jurídica não encontrada' });
        }

        res.json(pessoaJuridica);
    } catch (error) {
        console.error("Erro ao buscar Pessoa Jurídica:", error);
        res.status(500).json({ error: 'Erro ao buscar Pessoa Jurídica' });
    }
};

// 🔹 Atualizar uma Pessoa Jurídica
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha_hash, telefone, endereco, cnpj, razao_social, nome_fantasia, inscricao_estadual, eh_empresa } = req.body;

        // Validar se o ID é um UUID válido
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        // Buscar a Pessoa Jurídica e sua Pessoa relacionada em uma única consulta
        const pessoaJuridica = await PessoaJuridica.findByPk(id, { include: { model: Pessoa, as: 'pessoa' } });

        if (!pessoaJuridica) {
            return res.status(404).json({ error: 'Pessoa Jurídica não encontrada' });
        }

        // Verificar se o novo e-mail, telefone ou CNPJ já pertence a outra pessoa
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

        if (cnpj) {
            const cnpjExistente = await PessoaJuridica.findOne({
                where: {
                    cnpj,
                    id: { [Op.ne]: id } // Garante que não seja a própria pessoa
                }
            });

            if (cnpjExistente) {
                return res.status(400).json({ error: 'CNPJ já está em uso por outra pessoa' });
            }
        }

        // Atualizar os dados
        await pessoaJuridica.pessoa.update({ nome, email, senha_hash, telefone, endereco });
        await pessoaJuridica.update({ cnpj, razao_social, nome_fantasia, inscricao_estadual, eh_empresa });

        res.json({ ...pessoaJuridica.pessoa.toJSON(), ...pessoaJuridica.toJSON() });
    } catch (error) {
        console.error("Erro ao atualizar Pessoa Jurídica:", error);
        res.status(500).json({ error: 'Erro ao atualizar Pessoa Jurídica' });
    }
};

// 🔹 Deletar uma Pessoa Jurídica
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar se o ID é um UUID válido
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pessoaJuridica = await PessoaJuridica.findByPk(id, { include: { model: Pessoa, as: 'pessoa' } });

        if (!pessoaJuridica) {
            return res.status(404).json({ error: 'Pessoa Jurídica não encontrada' });
        }

        // Deleta primeiro a Pessoa associada
        await pessoaJuridica.pessoa.destroy();

        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar Pessoa Jurídica:", error);
        res.status(500).json({ error: 'Erro ao deletar Pessoa Jurídica' });
    }
};
