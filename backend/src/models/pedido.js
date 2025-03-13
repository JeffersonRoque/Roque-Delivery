const { Model, DataTypes } = require('sequelize');

class Pedido extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: sequelize.literal('uuid_generate_v4()'),
          primaryKey: true
        },
        pessoa_id: {
          type: DataTypes.UUID,
          allowNull: true, // Permitir valores NULL
        },
        preco_total: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
        },
        status: {
          type: DataTypes.ENUM('pendente', 'preparando', 'em_entrega', 'concluido', 'cancelado'),
          allowNull: false,
          defaultValue: 'pendente'
        },
        criado_em: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        },
        modificado_em: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        }
      },
      {
        sequelize,
        modelName: 'Pedido',
        tableName: 'pedidos',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'modificado_em'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'pessoa_id', as: 'pessoa', onDelete: 'SET NULL' });
  }
}

module.exports = Pedido;
