const { Model, DataTypes } = require('sequelize');

class Produto extends Model {
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
          allowNull: false
        },
        estoque: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {min: 0} // Garante que o estoque seja >= 0
        },
        categorias: {
          type: DataTypes.STRING
        },
        eh_alcoolico: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
      },
      {
        sequelize,
        modelName: 'Produto',
        tableName: 'produtos',
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

module.exports = Produto;
