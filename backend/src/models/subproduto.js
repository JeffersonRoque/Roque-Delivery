const { Model, DataTypes } = require('sequelize');

class Subproduto extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        nome: {
          type: DataTypes.STRING,
          allowNull: false
        },
        descricao: {
          type: DataTypes.TEXT,
        }
      },
      {
        sequelize,
        modelName: 'Subproduto',
        tableName: 'subprodutos',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'modificado_em'
      }
    );
  }
}

module.exports = Subproduto;