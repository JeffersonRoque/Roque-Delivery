const { Subproduto } = require('../models'); // Importando corretamente do index.js
const { Op } = require('sequelize'); // Operadores para consultas

// 🔹 Criar um novo subproduto
exports.createSubproduto = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar subproduto:", req.body); // Debug

        const { nome, descricao, preco, estoque } = req.body;

        if (!nome || preco == null || estoque == null) {
            return res.status(400).json({ error: 'Nome, preço e estoque são obrigatórios' });
        }

        // Verificar se já existe um subproduto com o mesmo nome
        const subprodutoExistente = await Subproduto.findOne({ where: { nome } });
        if (subprodutoExistente) {
            return res.status(400).json({ error: 'Já existe um subproduto com esse nome' });
        }

        const novoSubproduto = await Subproduto.create({ nome, descricao, preco, estoque });
        return res.status(201).json(novoSubproduto);
    } catch (error) {
        console.error("Erro ao criar subproduto:", error);
        return res.status(500).json({ error: 'Erro ao criar subproduto', details: error.message });
    }
};

// 🔹 Buscar todos os subprodutos
exports.getAllSubprodutos = async (req, res) => {
    try {
        const subprodutos = await Subproduto.findAll();
        res.json(subprodutos);
    } catch (error) {
        console.error("Erro ao buscar subprodutos:", error);
        res.status(500).json({ error: 'Erro ao buscar subprodutos', details: error.message });
    }
};

// 🔹 Buscar um subproduto por ID
exports.getSubprodutoById = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica se o ID é um UUID válido
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const subproduto = await Subproduto.findByPk(id);
        if (!subproduto) {
            return res.status(404).json({ error: 'Subproduto não encontrado' });
        }
        res.json(subproduto);
    } catch (error) {
        console.error("Erro ao buscar subproduto:", error);
        res.status(500).json({ error: 'Erro ao buscar subproduto', details: error.message });
    }
};

// 🔹 Atualizar um subproduto
exports.updateSubproduto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, preco, estoque } = req.body;

        // Verifica se o ID é um UUID válido
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const subproduto = await Subproduto.findByPk(id);
        if (!subproduto) {
            return res.status(404).json({ error: 'Subproduto não encontrado' });
        }

        // Verifica se o novo nome já pertence a outro subproduto
        if (nome) {
            const existeOutroSubproduto = await Subproduto.findOne({
                where: {
                    nome,
                    id: { [Op.ne]: id } // Garante que não seja o próprio subproduto
                }
            });

            if (existeOutroSubproduto) {
                return res.status(400).json({ error: 'Já existe um subproduto com esse nome' });
            }
        }

        await subproduto.update(req.body);
        res.json(subproduto);
    } catch (error) {
        console.error("Erro ao atualizar subproduto:", error);
        res.status(500).json({ error: 'Erro ao atualizar subproduto', details: error.message });
    }
};

// 🔹 Deletar um subproduto
exports.deleteSubproduto = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica se o ID é um UUID válido
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const subproduto = await Subproduto.findByPk(id);
        if (!subproduto) {
            return res.status(404).json({ error: 'Subproduto não encontrado' });
        }

        await subproduto.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar subproduto:", error);
        res.status(500).json({ error: 'Erro ao deletar subproduto', details: error.message });
    }
};

console.log("Modelo Subproduto carregado:", Subproduto);