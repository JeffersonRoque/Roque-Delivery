const { Model, DataTypes } = require('sequelize');

class NotaFiscal extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
        },
        pedido_id: {
          type: DataTypes.UUID,
          allowNull: false,
          unique: true,
          references: {
            model: 'Pedidos',
            key: 'id',
          },
        },
        emissor_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'Pessoas',
            key: 'id',
          },
        },
        numero_nota: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        status: {
          type: DataTypes.ENUM('ativa', 'cancelada'),
          allowNull: false,
          defaultValue: 'ativa',
        }
      },
      {
        sequelize,
        modelName: 'NotaFiscal',
        tableName: 'notas_fiscais',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'modificado_em'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pedido, { foreignKey: 'pedido_id', as: 'pedido' });
    this.belongsTo(models.Pessoa, { foreignKey: 'emissor_id', as: 'emissor' });
  }
}

module.exports = NotaFiscal;
