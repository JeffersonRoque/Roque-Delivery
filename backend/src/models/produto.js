const { Model, DataTypes } = require('sequelize');

class Produto extends Model {
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
}

module.exports = Produto;