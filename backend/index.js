const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: 'postgres://user_cinelog:password123@localhost:5432/cinelog'
});

// Cadastro com Hash de Senha (Requisito do Projeto)
app.post('/auth/signup', async (req, res) => {
  const { nome, email, senha } = req.body;
  const hash = await bcrypt.hash(senha, 10);
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome',
      [nome, email, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "E-mail já existe" });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, senha } = req.body;
  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  if (result.rows.length > 0) {
    const valid = await bcrypt.compare(senha, result.rows[0].senha);
    if (valid) return res.json({ msg: "Logado!", user: result.rows[0].nome });
  }
  res.status(401).json({ error: "Credenciais inválidas" });
});

app.listen(3001, () => console.log("Backend em http://localhost:3001"));