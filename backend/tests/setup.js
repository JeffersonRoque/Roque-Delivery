const { sequelize } = require("../src/models");

beforeAll(async () => {
  await sequelize.sync({ alter: true });
});

afterAll(async () => {
  await sequelize.close();
});
