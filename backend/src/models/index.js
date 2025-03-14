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
const AudiLog = require ('./auditLog.js');
const Avaliacao = require('./avaliacao.js');
const Cashback = require('./cashback.js');
const CashbackProduto = require ('./cashbackProduto.js');
const CashbackTransacao = require('./cashbackTransacao.js');
const Cupom = require('./cupom.js');
const CupomPessoa = require('./cupomPessoa.js');
const Entrega = require('./entrega.js');
const Funcionario = require('./funcionario.js');
const ItemPedido = require('./itemPedido.js');




const Pessoa = require('./pessoa.js');
const PessoaFisica = require('./pessoaFisica.js');
const PessoaJuridica = require('./pessoaJuridica.js');
const Produto = require('./produto.js');
const Relatorio = require('./relatorio.js');
const Subproduto = require('./subproduto.js');

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