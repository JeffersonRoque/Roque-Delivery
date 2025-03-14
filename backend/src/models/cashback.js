const { Model, DataTypes } = require('sequelize');

class Cashback extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        valor_acumulado: {
          type: DataTypes.DECIMAL(10, 2),
          defaultValue: 0,
          validate: {
            min: 0
          }
        },
        atualizado_em: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        },
        modificado_em: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        }
      },
      {
        sequelize,
        modelName: 'Cashback',
        tableName: 'cashback',
        timestamps: false
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'pessoa_id', as: 'pessoa', onDelete: 'CASCADE' });
  }
}

module.exports = Cashback;