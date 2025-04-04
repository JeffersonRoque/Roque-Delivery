const { ItemPedido, ItemPedidoSubproduto } = require('../models');

const calcularTotalPedido = async (pedidoId) => {
  try {
    let total = 0;

    const itens = await ItemPedido.findAll({
      where: { pedido_id: pedidoId },
      include: [
        {
          model: ItemPedidoSubproduto,
          as: 'subprodutos'
        }
      ]
    });

    for (const item of itens) {
      const precoItem = item.quantidade * item.preco_unitario;

      let precoSubprodutos = 0;
      if (item.subprodutos && item.subprodutos.length > 0) {
        for (const sub of item.subprodutos) {
          precoSubprodutos += sub.quantidade * sub.preco_unitario;
        }
      }

      total += precoItem + precoSubprodutos;
    }

    return total;

  } catch (error) {
    console.error('Erro ao calcular total do pedido:', error);
    throw error;
  }
};

module.exports = calcularTotalPedido;
