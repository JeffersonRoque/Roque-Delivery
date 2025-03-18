require('dotenv').config();
console.log(process.env);

const app = require('./app'); // Importa a configuração do app
const PORT = process.env.PORT || 3000; // Usa a porta do .env ou 3000 por padrão

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

app.get("/", (req, res) => res.send("Servidor rodando!"));
