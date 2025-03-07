const request = require('supertest');
const app = require('../tests/testServer'); // Garante que estamos testando o servidor correto
module.exports = app;
const { Sequelize } = require('sequelize');
const config = require('../config/config.js');

const sequelize = new Sequelize(config.development);

// Antes de rodar os testes, conecta no banco
beforeAll(async () => {
    await sequelize.authenticate();
});

// Após os testes, fecha a conexão
afterAll(async () => {
    await sequelize.close();
});

describe('Testes de Pessoa API', () => {
    test('Deve criar uma nova pessoa', async () => {
        const res = await request(app)
            .post('/pessoas')
            .send({
                tipo_pessoa: 'Cliente',
                nome: 'Teste Pessoa',
                email: 'teste@email.com',
                senha_hash: 'senha123',
                telefone: '999999999',
                endereco: 'Rua Teste, 123'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
    });

    test('Deve retornar todas as pessoas', async () => {
        const res = await request(app).get('/pessoas');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
