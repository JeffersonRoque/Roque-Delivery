const { Model, DataTypes } = require('sequelize');

class Pagamento extends Model {
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
        metodo_pagamento: {
          type: DataTypes.ENUM('cartao_credito', 'cartao_debito', 'pix', 'dinheiro'),
          allowNull: false
        },
        status: {
          type: DataTypes.ENUM('pendente', 'concluido', 'falhou'),
          allowNull: false
        },
        transacao_id: {
          type: DataTypes.STRING(100),
          allowNull: true // Pode ser nulo para pagamentos em dinheiro
        },
        valor_pago: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true // Pode ser nulo até o pagamento ser efetuado
        }
      },
      {
        sequelize,
        modelName: 'Pagamento',
        tableName: 'pagamentos',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'modificado_em'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pedido, { foreignKey: 'pedido_id', as: 'pedido' });
  }
}

module.exports = Pagamento;