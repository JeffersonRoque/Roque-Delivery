const { ProdutoSubproduto, Produto, Subproduto } = require('../models');
const { Op } = require('sequelize');

// 🔹 Criar vínculo entre produto e subproduto
exports.createVinculo = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar vínculo:", req.body);

        const { produto_id, subproduto_id, obrigatorio, ativo } = req.body;

        if (!produto_id || !subproduto_id) {
            return res.status(400).json({ error: 'Produto ID e Subproduto ID são obrigatórios' });
        }

        const vinculoExistente = await ProdutoSubproduto.findOne({
            where: { produto_id, subproduto_id }
        });

        if (vinculoExistente) {
            return res.status(400).json({ error: 'Este vínculo já existe' });
        }

        const novoVinculo = await ProdutoSubproduto.create({
            produto_id,
            subproduto_id,
            obrigatorio: obrigatorio ?? false,
            ativo: ativo ?? true
        });

        return res.status(201).json(novoVinculo);
    } catch (error) {
        console.error("Erro ao criar vínculo:", error);
        return res.status(500).json({ error: 'Erro ao criar vínculo', details: error.message });
    }
};

// 🔹 Buscar todos os vínculos (com filtros)
exports.getAllVinculos = async (req, res) => {
    try {
        const { produto_id, subproduto_id, obrigatorio, ativo } = req.query;

        const whereClause = {};

        if (produto_id) whereClause.produto_id = produto_id;
        if (subproduto_id) whereClause.subproduto_id = subproduto_id;
        if (obrigatorio !== undefined) whereClause.obrigatorio = obrigatorio === 'true';
        if (ativo !== undefined) whereClause.ativo = ativo === 'true';

        const vinculos = await ProdutoSubproduto.findAll({
            where: whereClause,
            include: [
                { model: Produto, as: 'produto' },
                { model: Subproduto, as: 'subproduto' }
            ],
            order: [['criado_em', 'DESC']]
        });

        res.json(vinculos);
    } catch (error) {
        console.error("Erro ao buscar vínculos:", error);
        res.status(500).json({ error: 'Erro ao buscar vínculos', details: error.message });
    }
};

// 🔹 Buscar vínculo por ID
exports.getVinculoById = async (req, res) => {
    try {
        const { id } = req.params;

        const vinculo = await ProdutoSubproduto.findByPk(id, {
            include: [
                { model: Produto, as: 'produto' },
                { model: Subproduto, as: 'subproduto' }
            ]
        });

        if (!vinculo) {
            return res.status(404).json({ error: 'Vínculo não encontrado' });
        }

        res.json(vinculo);
    } catch (error) {
        console.error("Erro ao buscar vínculo:", error);
        res.status(500).json({ error: 'Erro ao buscar vínculo', details: error.message });
    }
};

// 🔹 Atualizar vínculo
exports.updateVinculo = async (req, res) => {
    try {
        const { id } = req.params;

        const vinculo = await ProdutoSubproduto.findByPk(id);
        if (!vinculo) {
            return res.status(404).json({ error: 'Vínculo não encontrado' });
        }

        const { obrigatorio, ativo } = req.body;
        await vinculo.update({
            obrigatorio: obrigatorio ?? vinculo.obrigatorio,
            ativo: ativo ?? vinculo.ativo
        });

        res.json(vinculo);
    } catch (error) {
        console.error("Erro ao atualizar vínculo:", error);
        res.status(500).json({ error: 'Erro ao atualizar vínculo', details: error.message });
    }
};

// 🔹 Deletar vínculo
exports.deleteVinculo = async (req, res) => {
    try {
        const { id } = req.params;

        const vinculo = await ProdutoSubproduto.findByPk(id);
        if (!vinculo) {
            return res.status(404).json({ error: 'Vínculo não encontrado' });
        }

        await vinculo.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar vínculo:", error);
        res.status(500).json({ error: 'Erro ao deletar vínculo', details: error.message });
    }
};
