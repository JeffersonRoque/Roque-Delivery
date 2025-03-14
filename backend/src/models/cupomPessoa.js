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
        pessoa_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'pessoa', key: 'id' },
          onDelete: 'CASCADE' 
        },
        cupom_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'cupom', key: 'id' },
          onDelete: 'CASCADE' 
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
        tableName: 'cupons_pessoas',
        timestamps: true,
        createdAt: 'criado_em'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'pessoa_id', as: 'pessoa', onDelete: 'CASCADE' });
    this.belongsTo(models.Cupom, { foreignKey: 'cupom_id', as: 'cupom', onDelete: 'CASCADE' });
  }
}

module.exports = CupomPessoa;
