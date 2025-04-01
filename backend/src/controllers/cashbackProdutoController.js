const { CashbackProduto } = require('../models'); // Importando corretamente do index.js
const { Op } = require('sequelize'); // Operadores para consultas

// 🔹 Criar um novo Cashback para Produto
exports.createCashbackProduto = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar Cashback de Produto:", req.body);
        const { produto_id, percentual_cashback, ativo } = req.body;

        if (!produto_id || percentual_cashback === undefined) {
            return res.status(400).json({ error: 'Produto e percentual de cashback são obrigatórios' });
        }

        const novoCashback = await CashbackProduto.create({
            produto_id,
            percentual_cashback,
            ativo
        });

        return res.status(201).json(novoCashback);
    } catch (error) {
        console.error("Erro ao criar Cashback de Produto:", error);
        return res.status(500).json({ error: 'Erro ao criar Cashback de Produto', details: error.message });
    }
};

// 🔹 Buscar todos os Cashbacks de Produtos com filtros dinâmicos
exports.getAllCashbackProdutos = async (req, res) => {
    try {
        const { ativo, min_percentual, max_percentual } = req.query;
        
        const where = {};
        if (ativo !== undefined) where.ativo = ativo === 'true';
        if (min_percentual) where.percentual_cashback = { [Op.gte]: min_percentual };
        if (max_percentual) where.percentual_cashback = { ...where.percentual_cashback, [Op.lte]: max_percentual };

        const cashbacks = await CashbackProduto.findAll({ where });
        res.json(cashbacks);
    } catch (error) {
        console.error("Erro ao buscar Cashbacks de Produto:", error);
        res.status(500).json({ error: 'Erro ao buscar Cashbacks de Produto', details: error.message });
    }
};

// 🔹 Buscar um Cashback de Produto por ID
exports.getCashbackProdutoById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        
        const cashback = await CashbackProduto.findByPk(id);
        if (!cashback) {
            return res.status(404).json({ error: 'Cashback de Produto não encontrado' });
        }
        res.json(cashback);
    } catch (error) {
        console.error("Erro ao buscar Cashback de Produto:", error);
        res.status(500).json({ error: 'Erro ao buscar Cashback de Produto', details: error.message });
    }
};

// 🔹 Atualizar um Cashback de Produto
exports.updateCashbackProduto = async (req, res) => {
    try {
        const { id } = req.params;
        const { percentual_cashback, ativo } = req.body;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const cashback = await CashbackProduto.findByPk(id);
        if (!cashback) {
            return res.status(404).json({ error: 'Cashback de Produto não encontrado' });
        }

        await cashback.update({ 
            percentual_cashback,
            ativo: ativo !== undefined ? ativo : cashback.ativo // Mantém o valor atual se não for enviado
        });

        res.json(cashback);
    } catch (error) {
        console.error("Erro ao atualizar Cashback de Produto:", error);
        res.status(500).json({ error: 'Erro ao atualizar Cashback de Produto', details: error.message });
    }
};

// 🔹 Deletar um Cashback de Produto
exports.deleteCashbackProduto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const cashback = await CashbackProduto.findByPk(id);
        if (!cashback) {
            return res.status(404).json({ error: 'Cashback de Produto não encontrado' });
        }

        await cashback.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar Cashback de Produto:", error);
        res.status(500).json({ error: 'Erro ao deletar Cashback de Produto', details: error.message });
    }
};
