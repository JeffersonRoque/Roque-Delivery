const { Model, DataTypes } = require('sequelize');

class CashbackProduto extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        empresa_produto_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'empresaProduto', key: 'id' },
          onDelete: 'CASCADE' 
        },
        percentual_cashback: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
          validate: {
            min: 0
          }
        },
        ativo: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        }
      },
      {
        sequelize,
        modelName: 'CashbackProduto',
        tableName: 'cashback_produtos',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.EmpresaProduto, { foreignKey: 'empresa_produto_id', as: 'produto', onDelete: 'CASCADE' });
  }
}

module.exports = CashbackProduto;