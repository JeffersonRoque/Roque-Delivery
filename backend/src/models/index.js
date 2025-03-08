'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configFile = require('../../config/config.js');
const config = configFile[env] || {};
const db = {};

console.log("Config carregado no index.js:", config);

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], { dialect: config.dialect });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect
  });
}

// Lê todos os arquivos de modelos na pasta atual e os importa corretamente
fs
  .readdirSync(__dirname)
  .filter(file => (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file !== 'index.js' &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  ))
  .forEach(file => {
    const modelFactory = require(path.join(__dirname, file)); // Importa o arquivo do modelo
    const model = modelFactory.default ? modelFactory.default(sequelize, Sequelize.DataTypes) : modelFactory(sequelize, Sequelize.DataTypes); // Chama a função do modelo passando `sequelize`
    db[model.name] = model; // Adiciona o modelo ao objeto `db`
  });
  
const PessoaModel = require('./pessoa')(sequelize, Sequelize.DataTypes);
db.Pessoa = PessoaModel;

// Associações dos modelos, caso existam
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Pessoa = require('./pessoa')(sequelize, Sequelize.DataTypes); // Garante que Pessoa está sendo carregado

module.exports = db;
