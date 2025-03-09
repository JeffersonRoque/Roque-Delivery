const request = require('supertest');
const app = require('../tests/testServer'); // Importa o app do testserver.js
const { Pessoa } = require('../src/models'); // Importa o modelo para verificar se os dados estão no banco

beforeEach(async () => {
  await Pessoa.destroy({ where: {} }); // Limpa o banco antes de cada teste
});

describe('Testes de Pessoa API', () => {
  test('Deve criar uma nova pessoa', async () => {
    const res = await request(app)
    .post('/api/pessoas')
    .send({
      nome: 'Teste User',
      email: 'teste@email.com',
      senha_hash: '123456',
      tipo_pessoa: 'Cliente',
      telefone: '35 9 9786-1415',
      endereco: 'rua abc 20'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');

    // Confirma que a pessoa foi salva no banco
    const pessoa = await Pessoa.findOne({ where: { tipo_pessoa: 'Cliente' } });
    expect(pessoa).not.toBeNull();
  });

  test('Deve retornar todas as pessoas', async () => {
    // Criando uma pessoa antes do teste
    await Pessoa.create({
      nome: 'Teste User',
      email: 'teste@email.com',
      senha_hash: '123456',
      tipo_pessoa: 'Cliente',
      telefone: '35 9 9786-1415', 
      endereco: 'rua abc 20'     
    });
  
    const res = await request(app).get('/api/pessoas');
  
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // Garante que há pelo menos um registro
  });  
});
