const { Model, DataTypes } = require('sequelize');

class Localizacao extends Model {
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
          allowNull: true,
          references: { model: 'pessoa', key: 'id' } 
        },
        motorista_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: { model: 'motorista', key: 'id' }
        },
        latitude: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false
        },
        longitude: {
          type: DataTypes.DECIMAL(10, 6),
          allowNull: false
        },
      },
      {
        sequelize,
        modelName: 'Localizacao',
        tableName: 'localizacoes',
        timestamps: true
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'pessoa_id', as: 'pessoa' });
    this.belongsTo(models.Motorista, { foreignKey: 'motorista_id', as: 'motorista' });
  }
}

module.exports = Localizacao;
