const request = require('supertest');
const app = require('../src/app'); // Certifique-se que está importando o app correto
const { Pessoa } = require('../src/models');

describe('Testes de Pessoa API', () => {
  test('Deve criar uma nova pessoa', async () => {
    const response = await request(app)
      .post('/pessoas')
      .send({
        nome: 'João Silva',
        email: 'joao@example.com',
        senha_hash: 'senha123',
        telefone: '11999999999',
        endereco: 'Rua A, 123',
        tipo_pessoa: 'fisica'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  test('Deve retornar erro ao tentar criar pessoa sem campos obrigatórios', async () => {
    const response = await request(app).post('/pessoas').send({});
    expect(response.status).toBe(400);
  });

  test('Deve retornar todas as pessoas', async () => {
    const response = await request(app).get('/pessoas');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
