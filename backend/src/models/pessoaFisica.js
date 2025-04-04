const { Model, DataTypes } = require('sequelize');
const { hashValue } = require('../uteis/cryptoUtil');

class PessoaFisica extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          references: {model: 'pessoa', key: 'id'}
        },
        cpf_hash: {
          type: DataTypes.STRING,
          allowNull: false,
          set(value) {
            this.setDataValue('cpf_hash', hashValue(value));
          }
        },
        data_nascimento: {
          type: DataTypes.DATEONLY,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'PessoaFisica',
        tableName: 'pessoa_fisica',
        timestamps: false
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'id', as: 'pessoa' });
  }
}

module.exports = PessoaFisica;