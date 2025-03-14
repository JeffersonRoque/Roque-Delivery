const { Model, DataTypes } = require('sequelize');

class AuditLog extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: sequelize.literal('uuid_generate_v4()'),
          primaryKey: true
        },
        tabela_alvo: {
          type: DataTypes.STRING(50),
          allowNull: false
        },
        id_alvo: {
          type: DataTypes.UUID,
          allowNull: false
        },
        ip_usuario: {
          type: DataTypes.STRING(45),
          allowNull: true
        },
        coluna: {
          type: DataTypes.STRING(50),
          allowNull: false
        },
        valor_antigo: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        valor_novo: {
          type: DataTypes.TEXT,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'AuditLog',
        tableName: 'audit_logs',
        timestamps: true,
        createdAt: 'alterado_em',
        updatedAt: false
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'alterado_por', as: 'responsavel' });
  }
}

module.exports = AuditLog;