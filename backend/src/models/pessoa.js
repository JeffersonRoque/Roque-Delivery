const { Model, DataTypes } = require('sequelize');

class Pessoa extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        tipo_pessoa: {
          type: DataTypes.ENUM('fisica', 'juridica'),
          allowNull: false
        },
        nome: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        senha_hash: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        telefone: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        endereco: {
          type: DataTypes.TEXT,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'Pessoa',
        tableName: 'pessoas',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'modificado_em'
      }
    );
  }
}

module.exports = Pessoa;