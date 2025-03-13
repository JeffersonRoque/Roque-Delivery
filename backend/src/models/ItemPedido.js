const { Model, DataTypes } = require('sequelize');

class ItemPedido extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: sequelize.literal('uuid_generate_v4()'),
          primaryKey: true
        },
        pedido_id: {
          type: DataTypes.UUID,
          allowNull: false
        },
        produto_id: {
          type: DataTypes.UUID,
          allowNull: false
        },
        quantidade: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1 // Garante que a quantidade seja pelo menos 1
          }
        },
        preco_unitario: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
        },
        preco: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'ItemPedido',
        tableName: 'itens_pedido',
        timestamps: false
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pedido, { foreignKey: 'pedido_id', as: 'pedido', onDelete: 'CASCADE' });
    this.belongsTo(models.Produto, { foreignKey: 'produto_id', as: 'produto', onDelete: 'CASCADE' });
  }
}

module.exports = ItemPedido;