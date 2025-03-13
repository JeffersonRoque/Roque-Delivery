const express = require('express');
const pessoaRoutes = require('./routes/pessoaRoutes');
const pessoaFisicaRoutes = require('./routes/pessoaFisicaRoutes');
const pessoaJuridicaRoutes = require('./routes/pessoaJuridicaRoutes');

const app = express();

app.use(express.json());

app.use('/pessoas', pessoaRoutes);
app.use('/pessoas/fisica', pessoaFisicaRoutes);
app.use('/pessoas/juridica', pessoaJuridicaRoutes);

module.exports = app;