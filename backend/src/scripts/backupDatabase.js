const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const BACKUP_DIR = path.join(__dirname, "../backups");
const DB_NAME = process.env.DB_NAME; // Nome do seu banco
const DB_USER = process.env.DB_USER; // Usuário do PostgreSQL
const DB_PASSWORD = process.env.DB_PASS; // Senha do PostgreSQL (melhor usar variável de ambiente)
const DB_HOST = process.env.DB_HOST; // Host do banco (se estiver local)
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-"); // Formato seguro para nome de arquivo

async function backupDatabase() {
    try {
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }

        const backupFile = path.join(BACKUP_DIR, `backup_${TIMESTAMP}.sql`);
        const command = `PGPASSWORD=${DB_PASSWORD} pg_dump -h ${DB_HOST} -U ${DB_USER} -d ${DB_NAME} -F c -f ${backupFile}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error("Erro ao fazer backup:", error);
                return;
            }
            console.log(`Backup realizado com sucesso: ${backupFile}`);
        });
    } catch (error) {
        console.error("Erro geral ao fazer backup:", error);
    }
}

// Executa o backup
backupDatabase();
