const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'financas',
  port: parseInt(process.env.DB_PORT || '3306', 10),
};

async function migrate() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to DB');

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or exists.');

    // Check if user_id exists in transactions
    const [rows] = await connection.execute("SHOW COLUMNS FROM transactions LIKE 'user_id'");
    if (rows.length === 0) {
      await connection.execute('ALTER TABLE transactions ADD COLUMN user_id INT');
      console.log('Added user_id column to transactions.');

      // We won't strictly enforce foreign key constraints with old rows right now 
      // if they don't have user_id, to avoid crashing. Let's just set the foreign key loosely.
      // Or we can just let old data stay NULL if we make it nullable, but wait, we need NOT NULL.
      // If we put NOT NULL, existing rows will fail altered. 
      // Instead, we create a dummy user and assign old transactions to them.
      
      const [userResult] = await connection.execute(
        "INSERT IGNORE INTO users (username, password_hash) VALUES ('legacy_user', 'legacy_hash')"
      );
      const [legacyUserRows] = await connection.execute("SELECT id FROM users WHERE username = 'legacy_user'");
      
      if (legacyUserRows.length > 0) {
        const legacyId = legacyUserRows[0].id;
        await connection.execute('UPDATE transactions SET user_id = ? WHERE user_id IS NULL', [legacyId]);
      }
      
      // Now safe to add foreign key
      await connection.execute('ALTER TABLE transactions MODIFY COLUMN user_id INT NOT NULL');
      await connection.execute('ALTER TABLE transactions ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
      console.log('Foreign key applied and legacy data preserved.');
    } else {
      console.log('user_id column already exists.');
    }

    await connection.end();
    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
