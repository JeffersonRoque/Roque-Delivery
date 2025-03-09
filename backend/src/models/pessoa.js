const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Pessoa = sequelize.define('Pessoa', {
        id: {
            type: DataTypes.UUID,
            defaultValue: sequelize.literal('uuid_generate_v4()'),
            primaryKey: true
        },
        tipo_pessoa: {
            type: DataTypes.ENUM('fisica', 'juridica'),
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
        telefone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        endereco: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'pessoas'
    });

    return Pessoa;
};
