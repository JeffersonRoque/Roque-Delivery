const express = require("express");
const pessoaRoutes = require('../routes/pessoaRoutes');
const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

const sequelize = new Sequelize(config.development);

const app = express();
module.exports = app; // Exporte o app corretamente para os testes
app.use(express.json());

// Rotas
app.use('/pessoas', pessoaRoutes);

// Teste de conexão com o banco
sequelize.authenticate()
    .then(() => console.log('Banco de dados conectado'))
    .catch(err => console.error('Erro ao conectar no banco:', err));

app.get("/", (req, res) => res.send("Servidor rodando!"));

const http = require('http');
const server = http.createServer(app);
module.exports = server; // Exporte o servidor para testes