const { Model, DataTypes } = require('sequelize');

class Avaliacao extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: sequelize.literal('uuid_generate_v4()'),
          primaryKey: true
        },
        nota: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
            max: 5
          }
        },
        comentario: {
          type: DataTypes.TEXT,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'Avaliacao',
        tableName: 'avaliacoes',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: false
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'pessoa_id', as: 'cliente' });
    this.belongsTo(models.Motorista, { foreignKey: 'motorista_id', as: 'motorista' });
  }
}

module.exports = Avaliacao;