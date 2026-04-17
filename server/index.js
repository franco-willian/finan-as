const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secreta123';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Acesso negado' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido ou expirado' });
    req.user = user;
    next();
  });
}

// Configuração do banco de dados a partir das variáveis de ambiente
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Use uma senha forte em produção
  database: process.env.DB_NAME || 'financas',
  port: parseInt(process.env.DB_PORT || '3306', 10),
};

// Cria um pool de conexões MySQL
const pool = mysql.createPool(dbConfig);

// Middleware para logar requisições (opcional, mas útil para depuração)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// --- Rotas de Autenticação ---

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hashedPassword]);
    const token = jwt.sign({ id: result.insertId, username }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: result.insertId, username } });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Usuário já existe' });
    console.error(err);
    res.status(500).json({ message: 'Erro interno ao registrar' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ message: 'Credenciais inválidas' });
    
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Credenciais inválidas' });
    
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno ao logar' });
  }
});

// --- Rotas da API ---

// GET /api/transactions - Lista todas as transações
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM transactions WHERE user_id = ? ORDER BY data DESC, id DESC', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar transações:', err);
    res.status(500).json({ message: 'Erro ao carregar transações.' });
  }
});

// POST /api/transactions - Cria uma nova transação
app.post('/api/transactions', authenticateToken, async (req, res) => {
  const { titulo, valor, tipo, categoria, data } = req.body;

  if (!titulo || valor === undefined || !tipo || !categoria || !data) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios: titulo, valor, tipo, categoria, data.' });
  }

  // Garante que o valor seja armazenado com o sinal correto baseado no tipo
  const signedValor = tipo === 'despesa' ? -Math.abs(parseFloat(valor)) : Math.abs(parseFloat(valor));

  try {
    const [result] = await pool.execute(
      'INSERT INTO transactions (user_id, titulo, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, titulo, signedValor, tipo, categoria, data]
    );
    const newTransactionId = result.insertId;
    const [newTransactionRows] = await pool.execute('SELECT * FROM transactions WHERE id = ? AND user_id = ?', [newTransactionId, req.user.id]);
    res.status(201).json(newTransactionRows[0]); // Retorna a transação recém-criada
  } catch (err) {
    console.error('Erro ao adicionar transação:', err);
    res.status(500).json({ message: 'Erro ao adicionar transação.' });
  }
});

// PUT /api/transactions/:id - Atualiza uma transação existente
app.put('/api/transactions/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { titulo, valor, tipo, categoria, data } = req.body;

  const idInt = parseInt(id, 10);
  
  if (!titulo || valor === undefined || !tipo || !categoria || !data) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios para atualização: titulo, valor, tipo, categoria, data.' });
  }

  const dataLimpa = data && data.length >= 10 ? data.substring(0, 10) : data;
  const signedValor = tipo === 'despesa' ? -Math.abs(parseFloat(valor)) : Math.abs(parseFloat(valor));

  try {
    const [result] = await pool.execute(
      'UPDATE transactions SET titulo = ?, valor = ?, tipo = ?, categoria = ?, data = ? WHERE id = ? AND user_id = ?',
      [titulo, signedValor, tipo, categoria, dataLimpa, idInt, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transação não encontrada.' });
    }

    const [updatedTransactionRows] = await pool.execute('SELECT * FROM transactions WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json(updatedTransactionRows[0]); // Retorna a transação atualizada
  } catch (err) {
    console.error(`Erro ao atualizar transação ${id}:`, err);
    res.status(500).json({ message: 'Erro ao atualizar transação.' });
  }
});

// DELETE /api/transactions/:id - Exclui uma transação
app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);

  try {
    const [result] = await pool.execute('DELETE FROM transactions WHERE id = ? AND user_id = ?', [idInt, req.user.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transação não encontrada.' });
    }

    res.status(204).send(); // 204 No Content - indica sucesso na exclusão sem retornar corpo
  } catch (err) {
    console.error(`Erro ao excluir transação ${id}:`, err);
    res.status(500).json({ message: 'Erro ao excluir transação.' });
  }
});

// GET /api/balance - Retorna saldo total, receitas e despesas
app.get('/api/balance', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT SUM(CASE WHEN tipo = "receita" THEN valor ELSE 0 END) as totalReceitas, SUM(CASE WHEN tipo = "despesa" THEN ABS(valor) ELSE 0 END) as totalDespesas, SUM(valor) as saldoTotal FROM transactions WHERE user_id = ?', [req.user.id]);
    const { totalReceitas, totalDespesas, saldoTotal } = rows[0];
    res.json({
      balance: parseFloat(saldoTotal || 0).toFixed(2),
      revenues: parseFloat(totalReceitas || 0).toFixed(2),
      expenses: parseFloat(totalDespesas || 0).toFixed(2),
    });
  } catch (err) {
    console.error('Erro ao buscar saldo:', err);
    res.status(500).json({ message: 'Erro ao carregar saldo.' });
  }
});

// --- Rotas de Categorias ---

app.get('/api/categories', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM categories WHERE user_id = ? ORDER BY nome ASC', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    res.status(500).json({ message: 'Erro ao carregar categorias.' });
  }
});

app.post('/api/categories', authenticateToken, async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ message: 'Nome da categoria obrigatório' });
  try {
    const [result] = await pool.execute('INSERT INTO categories (user_id, nome) VALUES (?, ?)', [req.user.id, nome]);
    const [rows] = await pool.execute('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Erro ao adicionar categoria:', err);
    res.status(500).json({ message: 'Erro ao adicionar categoria.' });
  }
});

app.put('/api/categories/:oldName', authenticateToken, async (req, res) => {
  const { oldName } = req.params;
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ message: 'Novo nome obrigatório' });
  try {
    const [result] = await pool.execute('UPDATE categories SET nome = ? WHERE nome = ? AND user_id = ?', [nome, oldName, req.user.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Categoria não encontrada' });
    await pool.execute('UPDATE transactions SET categoria = ? WHERE categoria = ? AND user_id = ?', [nome, oldName, req.user.id]);
    res.json({ message: 'Categoria atualizada' });
  } catch (err) {
    console.error(`Erro ao atualizar categoria ${oldName}:`, err);
    res.status(500).json({ message: 'Erro ao atualizar categoria.' });
  }
});

app.delete('/api/categories/:name', authenticateToken, async (req, res) => {
  const { name } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM categories WHERE nome = ? AND user_id = ?', [name, req.user.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Categoria não encontrada' });
    await pool.execute('UPDATE transactions SET categoria = "Outros" WHERE categoria = ? AND user_id = ?', [name, req.user.id]);
    res.status(204).send();
  } catch (err) {
    console.error(`Erro ao excluir categoria ${name}:`, err);
    res.status(500).json({ message: 'Erro ao excluir categoria.' });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});