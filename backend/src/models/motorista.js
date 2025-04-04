const { Model, DataTypes } = require('sequelize');
const { hashValue } = require('../uteis/cryptoUtil');

class Motorista extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          references: { model: 'funcionario', key: 'id' }
        },
        cnh_hash: {
          type: DataTypes.STRING,
          allowNull: false,
          set(value) {
            this.setDataValue('cnh_hash', hashValue(value));
          }
        },
        validade_cnh: {
          type: DataTypes.DATEONLY,
          allowNull: false
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
        timestamps: false
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Funcionario, { foreignKey: 'id', as: 'funcionario' });
  }
}

module.exports = Motorista;