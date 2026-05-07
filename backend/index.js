const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

require('dotenv').config();

const conectarMongo = require('./mongo');
const Conteudo = require('./models/Conteudo');

const app = express();

app.use(cors());
app.use(express.json());

conectarMongo();

const pool = new Pool({
  connectionString: 'postgres://user_cinelog:password123@localhost:5432/cinelog'
});

app.get('/', (req, res) => {
  res.send('API CineLog funcionando');
});

app.get('/conteudos', async (req, res) => {
  try {
    const conteudos = await Conteudo.find();
    res.json(conteudos);
  } catch (err) {
    console.error('Erro ao buscar conteúdos:', err);
    res.status(500).json({ error: 'Erro ao buscar conteúdos' });
  }
});

app.post('/auth/signup', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const hash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email',
      [nome, email, hash]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro real no cadastro:', err);

    if (err.code === '23505') {
      return res.status(400).json({ error: 'E-mail já existe' });
    }

    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length > 0) {
      const valid = await bcrypt.compare(senha, result.rows[0].senha);

      if (valid) {
       return res.json({
       msg: 'Logado!',
       user: result.rows[0].nome,
       usuarioId: result.rows[0].id
});
      }
    }

    res.status(401).json({ error: 'Credenciais inválidas' });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro no login' });
  }
});
app.post('/avaliacoes', async (req, res) => {
  const { usuarioId, conteudoId, tituloConteudo, tipo, nota, comentario } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO avaliacoes 
       (usuario_id, conteudo_id, titulo_conteudo, tipo, nota, comentario)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [usuarioId, conteudoId, tituloConteudo, tipo, nota, comentario]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao salvar avaliação:', err);
    res.status(500).json({ error: 'Erro ao salvar avaliação' });
  }
});

app.get('/avaliacoes/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, titulo_conteudo, tipo, nota, comentario, criado_em
       FROM avaliacoes
       WHERE usuario_id = $1
       ORDER BY criado_em DESC`,
      [usuarioId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar avaliações:', err);
    res.status(500).json({ error: 'Erro ao buscar avaliações' });
  }
});
app.listen(3001, '0.0.0.0', () => {
  console.log('Backend rodando na porta 3001');
});