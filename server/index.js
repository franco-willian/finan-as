const express = require('express');
const mysql = require('mysql2/promise'); // Usando mysql2/promise para suporte a async/await
require('dotenv').config(); // Para carregar variáveis de ambiente do arquivo .env

const app = express();
app.use(express.json()); // Middleware para parsear corpos de requisição JSON

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

// --- Rotas da API ---

// GET /api/transactions - Lista todas as transações
app.get('/api/transactions', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM transactions ORDER BY data DESC, id DESC');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar transações:', err);
    res.status(500).json({ message: 'Erro ao carregar transações.' });
  }
});

// POST /api/transactions - Cria uma nova transação
app.post('/api/transactions', async (req, res) => {
  const { titulo, valor, tipo, categoria, data } = req.body;

  if (!titulo || valor === undefined || !tipo || !categoria || !data) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios: titulo, valor, tipo, categoria, data.' });
  }

  // Garante que o valor seja armazenado com o sinal correto baseado no tipo
  const signedValor = tipo === 'despesa' ? -Math.abs(parseFloat(valor)) : Math.abs(parseFloat(valor));

  try {
    const [result] = await pool.execute(
      'INSERT INTO transactions (titulo, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?)',
      [titulo, signedValor, tipo, categoria, data]
    );
    const newTransactionId = result.insertId;
    const [newTransactionRows] = await pool.execute('SELECT * FROM transactions WHERE id = ?', [newTransactionId]);
    res.status(201).json(newTransactionRows[0]); // Retorna a transação recém-criada
  } catch (err) {
    console.error('Erro ao adicionar transação:', err);
    res.status(500).json({ message: 'Erro ao adicionar transação.' });
  }
});

// PUT /api/transactions/:id - Atualiza uma transação existente
app.put('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, valor, tipo, categoria, data } = req.body;

  const idInt = parseInt(id, 10);
  
  if (!titulo || valor === undefined || !tipo || !categoria || !data) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios para atualização: titulo, valor, tipo, categoria, data.' });
  }

  // Ajuste do formato da data limitando os 10 primeiros caracteres (YYYY-MM-DD)
  const dataLimpa = data && data.length >= 10 ? data.substring(0, 10) : data;

  // Garante que o valor seja armazenado com o sinal correto baseado no tipo
  const signedValor = tipo === 'despesa' ? -Math.abs(parseFloat(valor)) : Math.abs(parseFloat(valor));

  try {
    const [result] = await pool.execute(
      'UPDATE transactions SET titulo = ?, valor = ?, tipo = ?, categoria = ?, data = ? WHERE id = ?',
      [titulo, signedValor, tipo, categoria, dataLimpa, idInt]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transação não encontrada.' });
    }

    const [updatedTransactionRows] = await pool.execute('SELECT * FROM transactions WHERE id = ?', [id]);
    res.json(updatedTransactionRows[0]); // Retorna a transação atualizada
  } catch (err) {
    console.error(`Erro ao atualizar transação ${id}:`, err);
    res.status(500).json({ message: 'Erro ao atualizar transação.' });
  }
});

// DELETE /api/transactions/:id - Exclui uma transação
app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);

  try {
    const [result] = await pool.execute('DELETE FROM transactions WHERE id = ?', [idInt]);

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
app.get('/api/balance', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT SUM(CASE WHEN tipo = "receita" THEN valor ELSE 0 END) as totalReceitas, SUM(CASE WHEN tipo = "despesa" THEN ABS(valor) ELSE 0 END) as totalDespesas, SUM(valor) as saldoTotal FROM transactions');
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

// Inicia o servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});