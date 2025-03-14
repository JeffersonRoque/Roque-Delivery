const { Model, DataTypes } = require('sequelize');

class CupomPessoa extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        usado: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        usado_em: {
          type: DataTypes.DATE,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'CupomPessoa',
        tableName: 'cupons_pessoas'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'pessoa_id', as: 'pessoa', onDelete: 'CASCADE' });
    this.belongsTo(models.Cupom, { foreignKey: 'cupom_id', as: 'cupom', onDelete: 'CASCADE' });
  }
}

module.exports = CupomPessoa;
