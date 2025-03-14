const { Model, DataTypes } = require('sequelize');

class PessoaJuridica extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          references: {model: 'pessoa', key: 'id'}
        },
        cnpj: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        razao_social: {
          type: DataTypes.STRING,
          allowNull: false
        },
        nome_fantasia: {
          type: DataTypes.STRING
        },
        inscricao_estadual: {
          type: DataTypes.STRING
        },
      },
      {
        sequelize,
        modelName: 'PessoaJuridica',
        tableName: 'pessoa_juridica'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'id', as: 'pessoa' });
  }
}

module.exports = PessoaJuridica;
