const request = require("supertest");
const app = require("../src/app");
const { sequelize } = require("../src/models"); // Importando o Sequelize para limpar o banco entre testes

describe("Testes de Pessoa API", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Resetando o banco antes dos testes
  });

  test("Deve criar uma nova pessoa", async () => {
    const res = await request(app).post("/pessoas").send({
      tipo_pessoa: "fisica",  // Campo obrigatório no modelo
      nome: "Teste",
      email: "teste@email.com",
      telefone: "123456789",
      endereco: "Rua Teste, 123",
      senha_hash: "senha123", // Alterado para bater com o modelo
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id"); // Verifica se a resposta tem um ID
  });

  test("Deve retornar erro ao tentar criar pessoa sem campos obrigatórios", async () => {
    const res = await request(app).post("/pessoas").send({
      nome: "Teste Incompleto",
    });

    expect(res.status).toBe(400); // Espera erro de validação
    expect(res.body).toHaveProperty("error"); // Deve conter mensagem de erro
  });

  test("Deve retornar todas as pessoas", async () => {
    const res = await request(app).get("/pessoas");
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
