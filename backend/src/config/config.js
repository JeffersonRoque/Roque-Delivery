require('dotenv').config();

console.log('DB_DIALECT carregado:', process.env.DB_DIALECT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);

const config = {
  development: {
    use_env_variable: 'DATABASE_URL', // Adicionado
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  },
  test: {  // <-- Adicionando a configuração para os testes
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  }
};

module.exports = config;