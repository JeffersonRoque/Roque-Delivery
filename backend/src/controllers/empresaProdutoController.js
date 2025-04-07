const { EmpresaProduto } = require('../models');
const { Op } = require('sequelize');

// 🔹 Criar um novo Produto de Empresa
exports.createEmpresaProduto = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar Produto da Empresa:", req.body);
        const { empresa_id, produto_id, preco, estoque } = req.body;

        if (!empresa_id || !produto_id || preco === undefined || estoque === undefined) {
            return res.status(400).json({ error: 'Campos obrigatórios: empresa_id, produto_id, preco, estoque' });
        }

        const novoProduto = await EmpresaProduto.create({
            empresa_id,
            produto_id,
            preco,
            estoque
        });

        return res.status(201).json(novoProduto);
    } catch (error) {
        console.error("Erro ao criar Produto da Empresa:", error);
        return res.status(500).json({ error: 'Erro ao criar Produto da Empresa', details: error.message });
    }
};

// 🔹 Buscar todos os Produtos de Empresas com filtros dinâmicos
exports.getAllEmpresaProdutos = async (req, res) => {
    try {
        const { empresa_id, produto_id, min_preco, max_preco, min_estoque } = req.query;
        
        const where = {};
        if (empresa_id) where.empresa_id = empresa_id;
        if (produto_id) where.produto_id = produto_id;
        if (min_preco) where.preco = { [Op.gte]: min_preco };
        if (max_preco) where.preco = { ...where.preco, [Op.lte]: max_preco };
        if (min_estoque) where.estoque = { [Op.gte]: min_estoque };

        const produtos = await EmpresaProduto.findAll({ where });
        res.json(produtos);
    } catch (error) {
        console.error("Erro ao buscar Produtos da Empresa:", error);
        res.status(500).json({ error: 'Erro ao buscar Produtos da Empresa', details: error.message });
    }
};

// 🔹 Buscar Produto da Empresa por ID
exports.getEmpresaProdutoById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const produto = await EmpresaProduto.findByPk(id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto da Empresa não encontrado' });
        }

        res.json(produto);
    } catch (error) {
        console.error("Erro ao buscar Produto da Empresa por ID:", error);
        res.status(500).json({ error: 'Erro ao buscar Produto da Empresa', details: error.message });
    }
};

// 🔹 Atualizar Produto da Empresa
exports.updateEmpresaProduto = async (req, res) => {
    try {
        const { id } = req.params;
        const { preco, estoque } = req.body;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const produto = await EmpresaProduto.findByPk(id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto da Empresa não encontrado' });
        }

        await produto.update({ 
            preco: preco !== undefined ? preco : produto.preco,
            estoque: estoque !== undefined ? estoque : produto.estoque
        });

        res.json(produto);
    } catch (error) {
        console.error("Erro ao atualizar Produto da Empresa:", error);
        res.status(500).json({ error: 'Erro ao atualizar Produto da Empresa', details: error.message });
    }
};

// 🔹 Deletar Produto da Empresa
exports.deleteEmpresaProduto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const produto = await EmpresaProduto.findByPk(id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto da Empresa não encontrado' });
        }

        await produto.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar Produto da Empresa:", error);
        res.status(500).json({ error: 'Erro ao deletar Produto da Empresa', details: error.message });
    }
};
