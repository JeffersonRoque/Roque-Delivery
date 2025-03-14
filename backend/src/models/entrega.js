const { Model, DataTypes } = require('sequelize');

class Entrega extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        pedido_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'pedido', key: 'id' }
        },
        motorista_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'motorista', key: 'id' }
        },
        status: {
          type: DataTypes.ENUM('pendente', 'em_transito', 'entregue', 'falhou'),
          allowNull: false
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
