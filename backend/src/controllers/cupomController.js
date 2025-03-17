const { Cupom } = require('../models');
const { Op } = require('sequelize'); // Operadores para consultas

// 🔹 Criar um novo Cupom
exports.createCupom = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar cupom:", req.body);

        const { codigo, descricao, desconto, tipo_desconto, valor_minimo, validade, quantidade_usos, ativo } = req.body;

        if (!codigo || !desconto || !tipo_desconto) {
            return res.status(400).json({ error: 'Código, desconto e tipo de desconto são obrigatórios' });
        }

        // Verifica se já existe um cupom com o mesmo código
        const cupomExistente = await Cupom.findOne({ where: { codigo } });

        if (cupomExistente) {
            return res.status(400).json({ error: 'Código do cupom já cadastrado' });
        }

        const novoCupom = await Cupom.create({ 
            codigo, 
            descricao, 
            desconto, 
            tipo_desconto, 
            valor_minimo, 
            validade, 
            quantidade_usos, 
            ativo 
        });

        return res.status(201).json(novoCupom);
    } catch (error) {
        console.error("Erro ao criar cupom:", error);
        return res.status(500).json({ error: 'Erro ao criar cupom', details: error.message });
    }
};

// 🔹 Buscar todos os Cupons
exports.getAllCupons = async (req, res) => {
    try {
        const cupons = await Cupom.findAll();
        res.json(cupons);
    } catch (error) {
        console.error("Erro ao buscar cupons:", error);
        res.status(500).json({ error: 'Erro ao buscar cupons', details: error.message });
    }
};

// 🔹 Buscar um Cupom por ID
exports.getCupomById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const cupom = await Cupom.findByPk(id);

        if (!cupom) {
            return res.status(404).json({ error: 'Cupom não encontrado' });
        }

        res.json(cupom);
    } catch (error) {
        console.error("Erro ao buscar cupom:", error);
        res.status(500).json({ error: 'Erro ao buscar cupom', details: error.message });
    }
};

// 🔹 Buscar um Cupom por Código
exports.getCupomByCodigo = async (req, res) => {
    try {
        const { codigo } = req.params;

        const cupom = await Cupom.findOne({ where: { codigo } });

        if (!cupom) {
            return res.status(404).json({ error: 'Cupom não encontrado' });
        }

        res.json(cupom);
    } catch (error) {
        console.error("Erro ao buscar cupom por código:", error);
        res.status(500).json({ error: 'Erro ao buscar cupom', details: error.message });
    }
};

// 🔹 Buscar Cupons Ativos
exports.getCuponsAtivos = async (req, res) => {
    try {
        const cuponsAtivos = await Cupom.findAll({
            where: {
                ativo: true,
                [Op.or]: [
                    { validade: { [Op.is]: null } },  // Cupons sem validade
                    { validade: { [Op.gte]: new Date() } }  // Cupons ainda válidos
                ]
            }
        });

        res.json(cuponsAtivos);
    } catch (error) {
        console.error("Erro ao buscar cupons ativos:", error);
        res.status(500).json({ error: 'Erro ao buscar cupons ativos', details: error.message });
    }
};

// 🔹 Atualizar um Cupom
exports.updateCupom = async (req, res) => {
    try {
        const { id } = req.params;
        const { codigo } = req.body;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const cupom = await Cupom.findByPk(id);

        if (!cupom) {
            return res.status(404).json({ error: 'Cupom não encontrado' });
        }

        // Verifica se o novo código já pertence a outro cupom
        if (codigo) {
            const existeOutroCupom = await Cupom.findOne({
                where: {
                    codigo,
                    id: { [Op.ne]: id } // Garante que não seja o próprio cupom
                }
            });

            if (existeOutroCupom) {
                return res.status(400).json({ error: 'Código do cupom já está em uso por outro cupom' });
            }
        }

        await cupom.update(req.body);
        res.json(cupom);
    } catch (error) {
        console.error("Erro ao atualizar cupom:", error);
        res.status(500).json({ error: 'Erro ao atualizar cupom', details: error.message });
    }
};

// 🔹 Deletar um Cupom
exports.deleteCupom = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const cupom = await Cupom.findByPk(id);

        if (!cupom) {
            return res.status(404).json({ error: 'Cupom não encontrado' });
        }

        await cupom.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar cupom:", error);
        res.status(500).json({ error: 'Erro ao deletar cupom', details: error.message });
    }
};
