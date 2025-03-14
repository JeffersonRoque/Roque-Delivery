const { Model, DataTypes } = require('sequelize');

class Relatorio extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: sequelize.literal('uuid_generate_v4()'),
          primaryKey: true
        },
        tipo_relatorio: {
          type: DataTypes.STRING(50),
          allowNull: false
        },
        descricao: {
          type: DataTypes.TEXT,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'Relatorio',
        tableName: 'relatorios',
        timestamps: true,
        createdAt: 'gerado_em',
        updatedAt: 'modificado_em'
      }
    );
  }
}

module.exports = Relatorio;