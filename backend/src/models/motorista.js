const { Model, DataTypes } = require('sequelize');

class Motorista extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          references: { model: 'funcionarios', key: 'id' }
        },
        tipo_veiculo: {
          type: DataTypes.STRING,
        },
        placa_veiculo: {
          type: DataTypes.STRING,
        }
      },
      {
        sequelize,
        modelName: 'Motorista',
        tableName: 'motoristas',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Funcionario, { foreignKey: 'id', as: 'funcionario' });
  }
}

module.exports = Motorista;