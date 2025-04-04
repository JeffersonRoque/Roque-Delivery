const { Model, DataTypes } = require('sequelize');

class ProdutoSubproduto extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        produto_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'pedido', key: 'id' },
            onDelete: 'CASCADE' 
        },
        subproduto_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'subproduto', key: 'id' },
          onDelete: 'CASCADE'
        },
        obrigatorio: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
      },
      {
        sequelize,
        modelName: 'ProdutoSubproduto',
        tableName: 'produto_subproduto',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'modificado_em'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Produto, { foreignKey: 'produto_id', as: 'produto', onDelete: 'CASCADE' });
    this.belongsTo(models.Subproduto, { foreignKey: 'subproduto_id', as: 'subproduto', onDelete: 'CASCADE' });
  }
}

module.exports = ProdutoSubproduto;