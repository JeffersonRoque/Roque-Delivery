const { EmpresaSubproduto } = require('../models');
const { Op } = require('sequelize');

// 🔹 Criar um novo registro de EmpresaSubproduto
exports.createEmpresaSubproduto = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar EmpresaSubproduto:", req.body);
        const { empresa_id, subproduto_id, preco, estoque } = req.body;

        if (!empresa_id || !subproduto_id || preco === undefined || estoque === undefined) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios: empresa_id, subproduto_id, preco e estoque.' });
        }

        const novoRegistro = await EmpresaSubproduto.create({ empresa_id, subproduto_id, preco, estoque });

        return res.status(201).json(novoRegistro);
    } catch (error) {
        console.error("Erro ao criar EmpresaSubproduto:", error);
        return res.status(500).json({ error: 'Erro ao criar EmpresaSubproduto', details: error.message });
    }
};

// 🔹 Buscar todos os registros de EmpresaSubproduto com filtros dinâmicos
exports.getAllEmpresaSubprodutos = async (req, res) => {
    try {
        const { empresa_id, subproduto_id, preco_min, preco_max, estoque_min, estoque_max } = req.query;

        const where = {};
        if (empresa_id) where.empresa_id = empresa_id;
        if (subproduto_id) where.subproduto_id = subproduto_id;
        if (preco_min) where.preco = { [Op.gte]: preco_min };
        if (preco_max) where.preco = { ...where.preco, [Op.lte]: preco_max };
        if (estoque_min) where.estoque = { [Op.gte]: estoque_min };
        if (estoque_max) where.estoque = { ...where.estoque, [Op.lte]: estoque_max };

        const registros = await EmpresaSubproduto.findAll({ where });
        res.json(registros);
    } catch (error) {
        console.error("Erro ao buscar EmpresaSubprodutos:", error);
        res.status(500).json({ error: 'Erro ao buscar EmpresaSubprodutos', details: error.message });
    }
};

// 🔹 Buscar um registro por ID
exports.getEmpresaSubprodutoById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const registro = await EmpresaSubproduto.findByPk(id);
        if (!registro) {
            return res.status(404).json({ error: 'EmpresaSubproduto não encontrado' });
        }
        res.json(registro);
    } catch (error) {
        console.error("Erro ao buscar EmpresaSubproduto:", error);
        res.status(500).json({ error: 'Erro ao buscar EmpresaSubproduto', details: error.message });
    }
};

// 🔹 Atualizar um registro
exports.updateEmpresaSubproduto = async (req, res) => {
    try {
        const { id } = req.params;
        const { preco, estoque } = req.body;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const registro = await EmpresaSubproduto.findByPk(id);
        if (!registro) {
            return res.status(404).json({ error: 'EmpresaSubproduto não encontrado' });
        }

        await registro.update({ 
            preco: preco !== undefined ? preco : registro.preco,
            estoque: estoque !== undefined ? estoque : registro.estoque
        });

        res.json(registro);
    } catch (error) {
        console.error("Erro ao atualizar EmpresaSubproduto:", error);
        res.status(500).json({ error: 'Erro ao atualizar EmpresaSubproduto', details: error.message });
    }
};

// 🔹 Deletar um registro
exports.deleteEmpresaSubproduto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const registro = await EmpresaSubproduto.findByPk(id);
        if (!registro) {
            return res.status(404).json({ error: 'EmpresaSubproduto não encontrado' });
        }

        await registro.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar EmpresaSubproduto:", error);
        res.status(500).json({ error: 'Erro ao deletar EmpresaSubproduto', details: error.message });
    }
};