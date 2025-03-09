module.exports = (sequelize, DataTypes) => {
    const PessoaJuridica = sequelize.define('PessoaJuridica', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: 'pessoas',
                key: 'id'
            }
        },
        cnpj: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        razao_social: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nome_fantasia: {
            type: DataTypes.STRING
        },
        inscricao_estadual: {
            type: DataTypes.STRING
        },
        eh_empresa: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true,
        tableName: 'pessoa_juridica'
    });
    
    PessoaJuridica.associate = (models) => {
        PessoaJuridica.belongsTo(models.Pessoa, { foreignKey: 'id', as: 'pessoa' });
    };
    
    return PessoaJuridica;
};