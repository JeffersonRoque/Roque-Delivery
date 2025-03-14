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
        pessoa_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'pessoa', key: 'id' },
          onDelete: 'CASCADE' 
        },
        valor_acumulado: {
          type: DataTypes.DECIMAL(10, 2),
          defaultValue: 0,
          validate: {
            min: 0
          }
        }
      },
      {
        sequelize,
        modelName: 'Cashback',
        tableName: 'cashback',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'pessoa_id', as: 'pessoa', onDelete: 'CASCADE' });
  }
}

module.exports = Cashback;