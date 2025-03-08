const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Pessoa = sequelize.define('Pessoa', {
        id: {
            type: DataTypes.UUID,
            defaultValue: sequelize.literal('uuid_generate_v4()'),
            primaryKey: true
        },
        tipo_pessoa: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        senha_hash: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        telefone: DataTypes.STRING,
        endereco: DataTypes.TEXT
    }, {
        timestamps: true,
        tableName: 'Pessoas'
    });

    return Pessoa;
};
