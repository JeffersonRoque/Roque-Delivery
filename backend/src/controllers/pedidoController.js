const { Pedido, Pessoa } = require('../models'); // Importando corretamente os modelos
const { Op } = require('sequelize'); // Operadores para consultas

// 🔹 Criar um novo pedido
exports.createPedido = async (req, res) => {
    try {
        console.log("Recebendo requisição para criar pedido:", req.body); // Debug

        const { pessoa_id, preco_total, status } = req.body;

        if (!preco_total || !status) {
            return res.status(400).json({ error: 'Os campos preco_total e status são obrigatórios' });
        }

        // Verificar se o status informado é válido
        const statusPermitidos = ['pendente', 'preparando', 'em_entrega', 'concluido', 'cancelado'];
        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({ error: 'Status inválido' });
        }

        // Verificar se a pessoa existe (caso tenha sido informada)
        if (pessoa_id) {
            const pessoa = await Pessoa.findByPk(pessoa_id);
            if (!pessoa) {
                return res.status(400).json({ error: 'Pessoa não encontrada' });
            }
        }

        const novoPedido = await Pedido.create({ pessoa_id, preco_total, status });

        return res.status(201).json(novoPedido);
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        return res.status(500).json({ error: 'Erro ao criar pedido', details: error.message });
    }
};

// 🔹 Buscar todos os pedidos
exports.getAllPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: { model: Pessoa, as: 'pessoa' } // Inclui os dados da pessoa associada ao pedido
        });
        res.json(pedidos);
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        res.status(500).json({ error: 'Erro ao buscar pedidos', details: error.message });
    }
};

// 🔹 Buscar um pedido por ID
exports.getPedidoById = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica se o ID é um UUID válido
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pedido = await Pedido.findByPk(id, {
            include: { model: Pessoa, as: 'pessoa' }
        });

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        res.json(pedido);
    } catch (error) {
        console.error("Erro ao buscar pedido:", error);
        res.status(500).json({ error: 'Erro ao buscar pedido', details: error.message });
    }
};

// 🔹 Buscar pedidos por status
exports.getPedidosByStatus = async (req, res) => {
    try {
        const { status } = req.params;

        // Lista de status permitidos
        const statusPermitidos = ['pendente', 'preparando', 'em_entrega', 'concluido', 'cancelado'];
        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({ error: 'Status inválido' });
        }

        const pedidos = await Pedido.findAll({
            where: { status },
            include: { model: Pessoa, as: 'pessoa' }
        });

        res.json(pedidos);
    } catch (error) {
        console.error("Erro ao buscar pedidos por status:", error);
        res.status(500).json({ error: 'Erro ao buscar pedidos', details: error.message });
    }
};

// 🔹 Buscar pedidos de um cliente específico
exports.getPedidosByPessoa = async (req, res) => {
    try {
        const { pessoa_id } = req.params;

        if (!pessoa_id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID de pessoa inválido' });
        }

        const pedidos = await Pedido.findAll({
            where: { pessoa_id },
            include: { model: Pessoa, as: 'pessoa' }
        });

        res.json(pedidos);
    } catch (error) {
        console.error("Erro ao buscar pedidos por pessoa:", error);
        res.status(500).json({ error: 'Erro ao buscar pedidos', details: error.message });
    }
};

// 🔹 Buscar pedidos dentro de um intervalo de datas
exports.getPedidosPorPeriodo = async (req, res) => {
    try {
        const { dataInicio, dataFim } = req.query;

        if (!dataInicio || !dataFim) {
            return res.status(400).json({ error: 'É necessário fornecer dataInicio e dataFim' });
        }

        const pedidos = await Pedido.findAll({
            where: {
                criado_em: {
                    [Op.between]: [new Date(dataInicio), new Date(dataFim)]
                }
            },
            include: { model: Pessoa, as: 'pessoa' }
        });

        res.json(pedidos);
    } catch (error) {
        console.error("Erro ao buscar pedidos por período:", error);
        res.status(500).json({ error: 'Erro ao buscar pedidos', details: error.message });
    }
};

// 🔹 Buscar pedidos recentes (últimos N pedidos)
exports.getUltimosPedidos = async (req, res) => {
    try {
        const limite = parseInt(req.query.limite) || 10; // Padrão: 10 pedidos

        const pedidos = await Pedido.findAll({
            order: [['criado_em', 'DESC']],
            limit: limite,
            include: { model: Pessoa, as: 'pessoa' }
        });

        res.json(pedidos);
    } catch (error) {
        console.error("Erro ao buscar últimos pedidos:", error);
        res.status(500).json({ error: 'Erro ao buscar últimos pedidos', details: error.message });
    }
};

// 🔹 Buscar pedidos concluídos ou cancelados
exports.getPedidosFinalizados = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            where: {
                status: {
                    [Op.in]: ['concluido', 'cancelado']
                }
            },
            include: { model: Pessoa, as: 'pessoa' }
        });

        res.json(pedidos);
    } catch (error) {
        console.error("Erro ao buscar pedidos finalizados:", error);
        res.status(500).json({ error: 'Erro ao buscar pedidos finalizados', details: error.message });
    }
};

// 🔹 Atualizar um pedido
exports.updatePedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { pessoa_id, preco_total, status } = req.body;

        // Verifica se o ID é um UUID válido
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        // Verifica se o novo status é válido
        const statusPermitidos = ['pendente', 'preparando', 'em_entrega', 'concluido', 'cancelado'];
        if (status && !statusPermitidos.includes(status)) {
            return res.status(400).json({ error: 'Status inválido' });
        }

        // Verifica se a pessoa existe (caso tenha sido informada)
        if (pessoa_id) {
            const pessoa = await Pessoa.findByPk(pessoa_id);
            if (!pessoa) {
                return res.status(400).json({ error: 'Pessoa não encontrada' });
            }
        }

        await pedido.update(req.body);
        res.json(pedido);
    } catch (error) {
        console.error("Erro ao atualizar pedido:", error);
        res.status(500).json({ error: 'Erro ao atualizar pedido', details: error.message });
    }
};

// 🔹 Deletar um pedido
exports.deletePedido = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica se o ID é um UUID válido
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        await pedido.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar pedido:", error);
        res.status(500).json({ error: 'Erro ao deletar pedido', details: error.message });
    }
};

console.log("Modelo Pedido carregado:", Pedido);