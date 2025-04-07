const { Model, DataTypes } = require('sequelize');

class EmpresaSubproduto extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        empresa_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'pessoaJuridica', key: 'id' },
          onDelete: 'CASCADE'
        },
        subproduto_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'subproduto', key: 'id' },
          onDelete: 'CASCADE'
        },
        preco: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
        },
        estoque: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0
          }
        }
      },
      {
        sequelize,
        modelName: 'EmpresaSubproduto',
        tableName: 'empresa_subprodutos',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'modificado_em',
        indexes: [
          {
            unique: true,
            fields: ['empresa_id', 'subproduto_id']
          }
        ]
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.PessoaJuridica, { foreignKey: 'empresa_id', as: 'empresa', onDelete: 'CASCADE' });
    this.belongsTo(models.Subproduto, { foreignKey: 'subproduto_id', as: 'subproduto', onDelete: 'CASCADE' });
  }
}

module.exports = EmpresaSubproduto;
