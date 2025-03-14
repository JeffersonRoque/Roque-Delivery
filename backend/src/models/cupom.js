const { Model, DataTypes } = require('sequelize');

class Cupom extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        codigo: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        descricao: {
          type: DataTypes.TEXT
        },
        desconto: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            min: 0.01 // Deve ser maior que 0
          }
        },
        tipo_desconto: {
          type: DataTypes.ENUM('percentual', 'fixo'),
          allowNull: false
        },
        valor_minimo: {
          type: DataTypes.DECIMAL(10, 2),
          defaultValue: 0
        },
        validade: {
          type: DataTypes.DATE,
          allowNull: true,
          validate: {
            isAfter: new Date().toISOString() // Valida que a data é no futuro
          }
        },
        quantidade_usos: {
          type: DataTypes.INTEGER,
          defaultValue: 1
        },
        ativo: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        }
      },
      {
        sequelize,
        modelName: 'Cupom',
        tableName: 'cupons',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'modificado_em'
      }
    );
  }
}

module.exports = Cupom;
