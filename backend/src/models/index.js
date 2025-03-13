'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

const db = {};

// 🔹 Inicializando Sequelize antes de usar
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

// 🔹 Importando os Models corretamente
const Pessoa = require('./pessoa');
const PessoaFisica = require('./pessoa_fisica');
const PessoaJuridica = require('./pessoa_juridica');

// 🔹 Inicializando os Models ANTES de associar
Pessoa.init(sequelize);
PessoaFisica.init(sequelize);
PessoaJuridica.init(sequelize);

// 🔹 Associando os Models
PessoaFisica.associate?.(sequelize.models);
PessoaJuridica.associate?.(sequelize.models);

// 🔹 Importando os demais modelos dinamicamente
fs.readdirSync(__dirname)
  .filter(file => file !== basename && file.endsWith('.js') && !file.endsWith('.test.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    if (typeof model.init === 'function') {
      model.init(sequelize);
    }
    db[model.name] = model;
  });

// 🔹 Associando os relacionamentos de todos os models carregados
Object.keys(db).forEach(modelName => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;