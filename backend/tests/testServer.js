const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('../src/routes/pessoaRoutes'); // Certifique-se de apontar para suas rotas
const { sequelize } = require('../src/models'); // Importa o Sequelize para garantir conexão ao banco

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/api/pessoas', routes); // Define o prefixo das rotas

// Conecta ao banco antes de rodar os testes
beforeAll(async () => {
  await sequelize.sync({ force: true }); // Limpa o banco antes dos testes
});

// Fecha a conexão depois dos testes
afterAll(async () => {
  await sequelize.close();
});

module.exports = app;