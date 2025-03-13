const { Model, DataTypes } = require('sequelize');

class ItemPedidoSubproduto extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: sequelize.literal('gen_random_uuid()'),
          primaryKey: true
        },
        item_pedido_id: {
          type: DataTypes.UUID,
          allowNull: false
        },
        subproduto_id: {
          type: DataTypes.UUID,
          allowNull: false
        },
        quantidade: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1 // Garante que a quantidade seja maior que 0
          }
        }
      },
      {
        sequelize,
        modelName: 'ItemPedidoSubproduto',
        tableName: 'itens_pedido_subprodutos',
        timestamps: false
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.ItemPedido, { foreignKey: 'item_pedido_id', as: 'itemPedido', onDelete: 'CASCADE' });
    this.belongsTo(models.Subproduto, { foreignKey: 'subproduto_id', as: 'subproduto', onDelete: 'CASCADE' });
  }
}

module.exports = ItemPedidoSubproduto;