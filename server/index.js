import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { pool } from './db.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/api/transactions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM transactions ORDER BY data DESC, id DESC')
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar transações' })
  }
})

app.get('/api/balance', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        COALESCE(SUM(valor), 0) AS saldo,
        COALESCE(SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END), 0) AS receitas,
        COALESCE(SUM(CASE WHEN tipo = 'despesa' THEN ABS(valor) ELSE 0 END), 0) AS despesas
      FROM transactions`
    )
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao calcular saldo' })
  }
})

app.post('/api/transactions', async (req, res) => {
  const { titulo, valor, tipo, categoria, data } = req.body

  if (!titulo || typeof valor !== 'number' || !tipo || !categoria || !data) {
    return res.status(400).json({ error: 'Dados da transação inválidos' })
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO transactions (titulo, valor, tipo, categoria, data) VALUES (?, ?, ?, ?, ?)',
      [titulo, valor, tipo, categoria, data]
    )

    const [rows] = await pool.query('SELECT * FROM transactions WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao salvar transação' })
  }
})

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`)
})
