const { CupomPessoa, Cupom, Pessoa } = require('../models');
const { Op } = require('sequelize'); // Operadores para filtros dinâmicos

// 🔹 Associar um Cupom a uma Pessoa
exports.createCupomPessoa = async (req, res) => {
    try {
        console.log("Recebendo requisição para associar cupom a pessoa:", req.body);

        const { pessoa_id, cupom_id } = req.body;

        if (!pessoa_id || !cupom_id) {
            return res.status(400).json({ error: 'Pessoa e Cupom são obrigatórios' });
        }

        // Verificar se a pessoa e o cupom existem e são válidos
        const [pessoa, cupom] = await Promise.all([
            Pessoa.findByPk(pessoa_id),
            Cupom.findByPk(cupom_id)
        ]);

        if (!pessoa) return res.status(404).json({ error: 'Pessoa não encontrada' });
        if (!cupom || !cupom.ativo) return res.status(400).json({ error: 'Cupom inválido ou inativo' });

        // Verificar se a pessoa já usou esse cupom
        const cupomUsado = await CupomPessoa.findOne({ where: { pessoa_id, cupom_id } });
        if (cupomUsado) {
            return res.status(400).json({ error: 'Cupom já utilizado por essa pessoa' });
        }

        const novaAssociacao = await CupomPessoa.create({ pessoa_id, cupom_id });

        return res.status(201).json(novaAssociacao);
    } catch (error) {
        console.error("Erro ao associar cupom a pessoa:", error);
        return res.status(500).json({ error: 'Erro ao associar cupom', details: error.message });
    }
};

// 🔹 Buscar Cupons usados por Pessoas com Filtros Dinâmicos
exports.getAllCuponsPessoas = async (req, res) => {
    try {
        const { pessoa_id, cupom_id, usado } = req.query;

        let where = {};
        if (pessoa_id) where.pessoa_id = pessoa_id;
        if (cupom_id) where.cupom_id = cupom_id;
        if (usado !== undefined) where.usado = usado === 'true';

        const cuponsPessoas = await CupomPessoa.findAll({
            where,
            include: [
                { model: Pessoa, as: 'pessoa' },
                { model: Cupom, as: 'cupom' }
            ]
        });

        res.json(cuponsPessoas);
    } catch (error) {
        console.error("Erro ao buscar cupons de pessoas:", error);
        res.status(500).json({ error: 'Erro ao buscar cupons de pessoas', details: error.message });
    }
};

// 🔹 Buscar Cupons de uma Pessoa com Filtros
exports.getCuponsByPessoa = async (req, res) => {
    try {
        const { pessoa_id } = req.params;
        const { usado } = req.query;

        if (!pessoa_id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        let where = { pessoa_id };
        if (usado !== undefined) where.usado = usado === 'true';

        const cupons = await CupomPessoa.findAll({
            where,
            include: [{ model: Cupom, as: 'cupom' }]
        });

        res.json(cupons);
    } catch (error) {
        console.error("Erro ao buscar cupons da pessoa:", error);
        res.status(500).json({ error: 'Erro ao buscar cupons da pessoa', details: error.message });
    }
};

// 🔹 Marcar um Cupom como Usado
exports.useCupom = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const cupomPessoa = await CupomPessoa.findByPk(id);

        if (!cupomPessoa) {
            return res.status(404).json({ error: 'Associação de cupom não encontrada' });
        }

        if (cupomPessoa.usado) {
            return res.status(400).json({ error: 'Cupom já foi utilizado' });
        }

        await cupomPessoa.update({ usado: true, usado_em: new Date() });

        res.json(cupomPessoa);
    } catch (error) {
        console.error("Erro ao marcar cupom como usado:", error);
        res.status(500).json({ error: 'Erro ao marcar cupom como usado', details: error.message });
    }
};

// 🔹 Deletar uma associação de Cupom e Pessoa
exports.deleteCupomPessoa = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const cupomPessoa = await CupomPessoa.findByPk(id);

        if (!cupomPessoa) {
            return res.status(404).json({ error: 'Associação de cupom não encontrada' });
        }

        await cupomPessoa.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar associação de cupom:", error);
        res.status(500).json({ error: 'Erro ao deletar associação de cupom', details: error.message });
    }
};
