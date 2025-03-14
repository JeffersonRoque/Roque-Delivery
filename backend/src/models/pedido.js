const { Model, DataTypes } = require('sequelize');

class Pedido extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        pessoa_id: {
          type: DataTypes.UUID,
          allowNull: true, // Permitir valores NULL
          references: { model: 'pessoa', key: 'id' },
          onDelete: 'SET NULL' 
        },
        preco_total: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
        },
        status: {
          type: DataTypes.ENUM('pendente', 'preparando', 'em_entrega', 'concluido', 'cancelado'),
          allowNull: false,
          defaultValue: 'pendente'
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
