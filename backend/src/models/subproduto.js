const { Model, DataTypes } = require('sequelize');

class Subproduto extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: sequelize.literal('uuid_generate_v4()'),
          primaryKey: true
        },
        nome: {
          type: DataTypes.STRING,
          allowNull: false
        },
        descricao: {
          type: DataTypes.TEXT,
        },
        preco: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {min: 0} // Garante que o preço seja >= 0
        },
        estoque: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {min: 0} // Garante que o estoque seja >= 0
        },
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

  static associate(models) {
    // Defina os relacionamentos, se necessário
  }
}

module.exports = Subproduto;