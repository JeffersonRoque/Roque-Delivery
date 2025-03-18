const { Produto } = require('../models');
const { Op } = require('sequelize');

// 🔹 Criar um novo produto
exports.createProduto = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar produto:", req.body);

        const { nome, descricao, preco, estoque, categorias, eh_alcoolico } = req.body;

        if (!nome || !preco || estoque === undefined) {
            return res.status(400).json({ error: 'Nome, preço e estoque são obrigatórios' });
        }

        // Verificar se já existe um produto com o mesmo nome
        const produtoExistente = await Produto.findOne({ where: { nome } });
        if (produtoExistente) {
            return res.status(400).json({ error: 'Produto com este nome já cadastrado' });
        }

        const novoProduto = await Produto.create({ nome, descricao, preco, estoque, categorias, eh_alcoolico });

        return res.status(201).json(novoProduto);
    } catch (error) {
        console.error("Erro ao criar produto:", error);
        return res.status(500).json({ error: 'Erro ao criar produto', details: error.message });
    }
};

// 🔹 Buscar produtos com filtros dinâmicos
exports.getAllProdutos = async (req, res) => {
    try {
        const { nome, preco_min, preco_max, estoque_min, estoque_max, categorias, eh_alcoolico, ordenacao, limite } = req.query;

        let whereClause = {};

        if (nome) whereClause.nome = { [Op.iLike]: `%${nome}%` };
        if (preco_min || preco_max) whereClause.preco = { [Op.between]: [preco_min || 0, preco_max || Number.MAX_VALUE] };
        if (estoque_min || estoque_max) whereClause.estoque = { [Op.between]: [estoque_min || 0, estoque_max || Number.MAX_VALUE] };
        if (categorias) whereClause.categorias = { [Op.contains]: [categorias] };
        if (eh_alcoolico !== undefined) whereClause.eh_alcoolico = eh_alcoolico === 'true';

        const produtos = await Produto.findAll({
            where: whereClause,
            order: [['criado_em', ordenacao === 'asc' ? 'ASC' : 'DESC']],
            limit: limite ? parseInt(limite) : null
        });

        res.json(produtos);
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).json({ error: 'Erro ao buscar produtos', details: error.message });
    }
};

// 🔹 Buscar um produto por ID
exports.getProdutoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const produto = await Produto.findByPk(id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.json(produto);
    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        res.status(500).json({ error: 'Erro ao buscar produto', details: error.message });
    }
};

// 🔹 Atualizar um produto
exports.updateProduto = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const produto = await Produto.findByPk(id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        await produto.update(req.body);
        res.json(produto);
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).json({ error: 'Erro ao atualizar produto', details: error.message });
    }
};

// 🔹 Deletar um produto
exports.deleteProduto = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const produto = await Produto.findByPk(id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        await produto.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        res.status(500).json({ error: 'Erro ao deletar produto', details: error.message });
    }
};