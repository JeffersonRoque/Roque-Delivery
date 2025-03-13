const { sequelize } = require("../src/models");

beforeAll(async () => {
  await sequelize.authenticate(); // Testa conexão antes de rodar os testes
  await sequelize.sync({force: true})
});

afterAll(async () => {
  await sequelize.close();
});
