const { Model, DataTypes } = require('sequelize');

class AuditLog extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
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
        },
        alterado_por: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'funcionario', key: 'id' }
        }
      },
      {
        sequelize,
        modelName: 'AuditLog',
        tableName: 'audit_logs',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'modificado_em'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Funcionario, { foreignKey: 'alterado_por', as: 'responsavel' });
  }
}

module.exports = AuditLog;