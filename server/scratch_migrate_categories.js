const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'financas',
  port: parseInt(process.env.DB_PORT || '3306', 10),
};

async function migrateCategories() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to DB...');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        nome VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Tabela categories validada e criada!');

    await connection.execute(`
      INSERT INTO categories (user_id, nome)
      SELECT DISTINCT user_id, categoria
      FROM transactions t
      WHERE NOT EXISTS (
        SELECT 1 FROM categories c 
        WHERE c.user_id = t.user_id AND c.nome = t.categoria
      )
    `);
    console.log('Categorias legadas foram importadas para suas devidas contas.');

    await connection.end();
    console.log('Migration pronta!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrateCategories();
