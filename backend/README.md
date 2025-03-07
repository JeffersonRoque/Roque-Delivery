Roque Delivery - Backend 🚀
Este é o backend da aplicação Roque Delivery, desenvolvido em Node.js com Express e Sequelize, utilizando PostgreSQL como banco de dados.

📌 Tecnologias utilizadas
Node.js + Express → Servidor backend
Sequelize → ORM para banco de dados
PostgreSQL → Banco de dados
Jest + Supertest → Testes automatizados
Dotenv → Gerenciamento de variáveis de ambiente

📂 Estrutura do projeto
bash
Copiar
Editar
backend/
│── config/            # Configuração do banco de dados (config.js)
│── controllers/       # Lógica das rotas
│── models/            # Definição das tabelas do banco
│── routes/            # Rotas da API
│── tests/             # Testes automatizados (Jest + Supertest)
│── testserver.js      # Servidor para testes
│── server.js          # Servidor principal da API
│── .env               # Configurações sensíveis (NÃO subir no GitHub)
│── package.json       # Dependências e scripts
│── README.md          # Documentação do backend

🛠️ Como instalar e rodar o backend
1️⃣ Clonar o repositório
git clone https://github.com/seu-usuario/Roque-Delivery.git
cd Roque-Delivery/backend

2️⃣ Instalar as dependências
npm install

3️⃣ Configurar o banco de dados
Crie um arquivo .env dentro da pasta backend/ e adicione:

ini
Copiar
Editar
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=roque_deliverydb
DB_HOST=localhost
DB_DIALECT=postgres
(Ou altere conforme suas credenciais do PostgreSQL)

4️⃣ Rodar as migrações do banco
npx sequelize db:migrate
Isso cria as tabelas no banco.

5️⃣ Iniciar o servidor
npm start
O backend rodará em http://localhost:3000/.

📌 Rotas da API 

➕ Criar uma nova pessoa

📍 POST /pessoas
📤 Body (JSON)
{
  "tipo_pessoa": "Cliente",
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha_hash": "senha123",
  "telefone": "999999999",
  "endereco": "Rua Teste, 123"
}

✅ Resposta (201 - Criado)
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "999999999",
  "endereco": "Rua Teste, 123"
}

📋 Listar todas as pessoas

📍 GET /pessoas
✅ Resposta (200 - OK)
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "999999999"
  }
]
(E assim por diante para outras rotas)

🧪 Rodar os testes
Para rodar os testes automatizados, execute:
npm test


