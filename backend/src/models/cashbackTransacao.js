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
        pessoa_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'pessoa', key: 'id' },
          onDelete: 'CASCADE' 
        },
        produto_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'produto', key: 'id' },
          onDelete: 'SET NULL' 
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
        }
      },
      {
        sequelize,
        modelName: 'CashbackTransacao',
        tableName: 'cashback_transacoes',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'modificado_em'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'pessoa_id', as: 'pessoa', onDelete: 'CASCADE' });
    this.belongsTo(models.Pedido, { foreignKey: 'pedido_id', as: 'pedido', onDelete: 'SET NULL' });
  }
}

module.exports = CashbackTransacao;