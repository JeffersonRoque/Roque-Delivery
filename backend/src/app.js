const express = require('express');

const auditLog = require('./routes/auditLogRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
const cashbackRoutes = require('./routes/cashbackRoutes');
const cashbackProduto = require('./routes/cashbackProdutoRoutes');
const cashbackTransacao = require('./routes/cashbackTransacaoRoutes');
const cupomRoutes = require('./routes/cupomRoutes');
const cupomPessoaRoutes = require('./routes/cupomPessoaRoutes');
const empresaProdutoRoutes = require('./routes/empresaProdutoRoutes');
const empresaSubprodutoRoutes = require('./routes/empresaSubprodutoRoutes');
const entregaRoutes = require('./routes/entregaRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const itemPedidoRoutes = require('./routes/itemPedidoRoutes');
const itemPedidoSubprodutoRoutes = require('./routes/itemPedidoSubprodutoRoutes');
const localizacaoRoutes = require('./routes/localizacaoRoutes');
const motoristaRoutes = require('./routes/motoristaRoutes');
const notaFiscalRoutes = require('./routes/notaFiscalRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const pessoaRoutes = require('./routes/pessoaRoutes');
const pessoaFisicaRoutes = require('./routes/pessoaFisicaRoutes');
const pessoaJuridicaRoutes = require('./routes/pessoaJuridicaRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const produtoSubprodutoRoutes = require('./routes/produtoSubprodutoRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');
const subprodutoRoutes = require('./routes/subprodutoRoutes');

const app = express();

app.use(express.json());

app.use('/audit-logs', auditLog);
app.use('/avaliacoes', avaliacaoRoutes);
app.use('/cashback', cashbackRoutes);
app.use('/cashback-produtos', cashbackProduto)
app.use('/cashbach-transacoes', cashbackTransacao);
app.use('/cupons', cupomRoutes);
app.use('/cupons-pessoas', cupomPessoaRoutes);
app.use('/empresa-produtos', empresaProdutoRoutes);
app.use('/empresa-subprodutos', empresaSubprodutoRoutes);
app.use('/entregas', entregaRoutes);
app.use('/funcionarios', funcionarioRoutes);
app.use('/itens-pedidos', itemPedidoRoutes);
app.use('/itens-pedido-subprodutos', itemPedidoSubprodutoRoutes);
app.use('/localizacoes', localizacaoRoutes);
app.use('/motoristas', motoristaRoutes);
app.use('/notas-fiscais', notaFiscalRoutes);
app.use('/pagamentos', pagamentoRoutes);
app.use('/pessoas', pessoaRoutes);
app.use('/pessoas-fisica', pessoaFisicaRoutes);
app.use('/pessoas-juridica', pessoaJuridicaRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/produtos', produtoRoutes);
app.use('/produtos-subprodutos', produtoSubprodutoRoutes);
app.use('/relatorios', relatorioRoutes);
app.use('/subprodutos', subprodutoRoutes);

module.exports = app;