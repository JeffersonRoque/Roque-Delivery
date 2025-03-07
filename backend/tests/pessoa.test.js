const request = require('supertest');
const app = require('../tests/testServer'); // Importa o app do testserver.js
const { Pessoa } = require('../src/models'); // Importa o modelo para verificar se os dados estão no banco

beforeEach(async () => {
  await Pessoa.destroy({ where: {} }); // Limpa o banco antes de cada teste
});

describe('Testes de Pessoa API', () => {
  test('Deve criar uma nova pessoa', async () => {
    const res = await request(app)
      .post('/api/pessoas') // Ajuste a URL se necessário
      .send({ tipo_pessoa: 'Cliente' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');

    // Confirma que a pessoa foi salva no banco
    const pessoa = await Pessoa.findOne({ where: { tipo_pessoa: 'Cliente' } });
    expect(pessoa).not.toBeNull();
  });

  test('Deve retornar todas as pessoas', async () => {
    // Criando uma pessoa antes do teste
    await Pessoa.create({ tipo_pessoa: 'Cliente' });

    const res = await request(app).get('/api/pessoas');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });
});
