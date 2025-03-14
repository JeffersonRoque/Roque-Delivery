const { Model, DataTypes } = require('sequelize');

class CashbackTransacao extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        valor: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            min: 0.01
          }
        },
        tipo_transacao: {
          type: DataTypes.ENUM('credito', 'debito'),
          allowNull: false
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
        modelName: 'CashbackTransacao',
        tableName: 'cashback_transacoes',
        timestamps: false
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'pessoa_id', as: 'pessoa', onDelete: 'CASCADE' });
    this.belongsTo(models.Pedido, { foreignKey: 'pedido_id', as: 'pedido', onDelete: 'SET NULL' });
  }
}

module.exports = CashbackTransacao;