require('dotenv').config();

require('dotenv').config();

console.log("DB_DIALECT carregado:", process.env.DB_DIALECT);

const config = {
  development: {
    use_env_variable: 'DATABASE_URL', // Adicionado
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  },
  test: {  // <-- Adicionando a configuração para os testes
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  }
};

module.exports = config;