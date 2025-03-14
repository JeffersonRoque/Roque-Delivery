const { Model, DataTypes } = require('sequelize');

class PessoaFisica extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          references: {model: 'pessoa', key: 'id'}
        },
        cpf: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        data_nascimento: {
          type: DataTypes.DATEONLY,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'PessoaFisica',
        tableName: 'pessoa_fisica'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'id', as: 'pessoa' });
  }
}

module.exports = PessoaFisica;