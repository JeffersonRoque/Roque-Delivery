const { Model, DataTypes } = require('sequelize');

class Entrega extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: sequelize.literal('uuid_generate_v4()'),
          primaryKey: true
        },
        pedido_id: {
          type: DataTypes.UUID,
          allowNull: false
        },
        motorista_id: {
          type: DataTypes.UUID,
          allowNull: false
        },
        status: {
          type: DataTypes.ENUM('pendente', 'em_transito', 'entregue', 'falhou'),
          allowNull: false
        },
        entregue_em: {
          type: DataTypes.DATE
        }
      },
      {
        sequelize,
        modelName: 'Entrega',
        tableName: 'entregas',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'modificado_em'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pedido, { foreignKey: 'pedido_id', as: 'pedido' });
    this.belongsTo(models.Motorista, { foreignKey: 'motorista_id', as: 'motorista' });
  }
}

module.exports = Entrega;
