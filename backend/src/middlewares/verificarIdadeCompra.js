const { PessoaFisica, Produto, Pedido } = require('../models');

const verificarIdadeCompra = async (req, res, next) => {
  try {
    const { pedido_id, produto_id } = req.body;

    // 🔹 Obter o ID do comprador a partir do pedido
    const pedido = await Pedido.findByPk(pedido_id);
    if (!pedido) {
      return res.status(400).json({ error: 'Pedido não encontrado.' });
    }

    // 🔹 Verificar se a pessoa é física
    const pessoaFisica = await PessoaFisica.findOne({ where: { id: pedido.pessoa_id } });
    if (!pessoaFisica) {
      return next(); // Se não for pessoa física, permitir a compra
    }

    // 🔹 Calcular a idade do comprador
    const dataNascimento = new Date(pessoaFisica.data_nascimento);
    const idade = new Date().getFullYear() - dataNascimento.getFullYear();

    // 🔹 Verificar se o produto é alcoólico
    const produto = await Produto.findByPk(produto_id);
    if (!produto) {
      return res.status(400).json({ error: 'Produto não encontrado.' });
    }

    // 🔹 Bloquear compra se o comprador for menor de 18 anos e o produto for alcoólico
    if (produto.eh_alcoolico && idade < 18) {
      return res.status(403).json({ error: 'Menores de 18 anos não podem comprar bebidas alcoólicas.' });
    }

    next(); // 🔹 Permitir a inserção do item no pedido
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao verificar a idade do comprador.' });
  }
};

module.exports = verificarIdadeCompra;