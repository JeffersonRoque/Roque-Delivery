module.exports = (sequelize, DataTypes) => {
    const PessoaFisica = sequelize.define('PessoaFisica', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: 'pessoas',
                key: 'id'
            }
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        data_nascimento: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'pessoa_fisica'
    });
    
    PessoaFisica.associate = (models) => {
        PessoaFisica.belongsTo(models.Pessoa, { foreignKey: 'id', as: 'pessoa' });
    };
    
    return PessoaFisica;
};