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
const ItemPedidoSubproduto = require('./itemPedidoSubproduto.js');
const Localizacao = require('./localizacao.js');
const Motorista = require('./motorista.js');
const NotaFiscal = require('./notaFiscal.js');
const Pagamento = require('./pagamento.js');
const Pedido = require('./pedido.js');
const Pessoa = require('./pessoa.js');
const PessoaFisica = require('./pessoaFisica.js');
const PessoaJuridica = require('./pessoaJuridica.js');
const Produto = require('./produto.js');
const Relatorio = require('./relatorio.js');
const Subproduto = require('./subproduto.js');

// 🔹 Inicializando os Models ANTES de associar
AudiLog.init(sequelize);
Avaliacao.init(sequelize);
Cashback.init(sequelize);
CashbackProduto.init(sequelize);
CashbackTransacao.init(sequelize);
Cupom.init(sequelize);
CupomPessoa.init(sequelize);
Entrega.init(sequelize);
Funcionario.init(sequelize);
ItemPedido.init(sequelize);
ItemPedidoSubproduto.init(sequelize);
Localizacao.init(sequelize);
Motorista.init(sequelize);
NotaFiscal.init(sequelize);
Pagamento.init(sequelize);
Pedido.init(sequelize);
Pessoa.init(sequelize);
PessoaFisica.init(sequelize);
PessoaJuridica.init(sequelize);
Produto.init(sequelize);
Relatorio.init(sequelize);
Subproduto.init(sequelize);

// 🔹 Associando os Models
AudiLog.associate?.(sequelize.models);
Avaliacao.associate?.(sequelize.models);
Cashback.associate?.(sequelize.models);
CashbackProduto.associate?.(sequelize.models);
CashbackTransacao.associate?.(sequelize.models);
CupomPessoa.associate?.(sequelize.models);
Entrega.associate?.(sequelize.models);
Funcionario.associate?.(sequelize.models);
ItemPedido.associate?.(sequelize.models);
ItemPedidoSubproduto.associate?.(sequelize.models);
Localizacao.associate?.(sequelize.models);
Motorista.associate?.(sequelize.models);
NotaFiscal.associate?.(sequelize.models);
Pagamento.associate?.(sequelize.models);
Pedido.associate?.(sequelize.models);
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