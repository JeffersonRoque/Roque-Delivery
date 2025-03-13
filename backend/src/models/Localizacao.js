const { Model, DataTypes } = require('sequelize');

class Localizacao extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: sequelize.literal('uuid_generate_v4()'),
          primaryKey: true
        },
        pessoa_id: {
          type: DataTypes.UUID,
          allowNull: true // Pode ser nulo se for localização de um motorista
        },
        motorista_id: {
          type: DataTypes.UUID,
          allowNull: true // Pode ser nulo se for localização de uma pessoa
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
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'modificado_em'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'pessoa_id', as: 'pessoa' });
    this.belongsTo(models.Motorista, { foreignKey: 'motorista_id', as: 'motorista' });
  }
}

module.exports = Localizacao;
