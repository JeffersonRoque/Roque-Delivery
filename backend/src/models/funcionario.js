const { Model, DataTypes } = require('sequelize');

class Funcionario extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          references: { model: 'pessoa_fisica', key: 'id' }
        },
        cargo: {
          type: DataTypes.STRING,
          allowNull: false
        },
      },
      {
        sequelize,
        modelName: 'Funcionario',
        tableName: 'funcionarios',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.PessoaFisica, { foreignKey: 'id', as: 'pessoaFisica' });
    this.belongsTo(models.Pessoa, { foreignKey: 'empregador_id', as: 'empregador' });
  }
}

module.exports = Funcionario;
