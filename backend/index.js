const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

require('dotenv').config();

const conectarMongo = require('./mongo');
const Conteudo = require('./models/Conteudo');

// 1. IMPORTAÇÃO DO NEO4J AQUI NO TOPO
// (Se você colocou o arquivo neo4j.js em uma pasta config, mude para './config/neo4j')
const neo4jDriver = require('./neo4j'); 

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
    // 1. Busca todos os conteúdos que estão cadastrados no MongoDB
    const conteudos = await Conteudo.find();

    // 2. Busca a média das notas agrupadas por ID do conteúdo lá no PostgreSQL
    const querySQL = `
      SELECT conteudo_id, ROUND(AVG(nota), 1) as media 
      FROM avaliacoes 
      GROUP BY conteudo_id
    `;
    const resultadoPostgres = await pool.query(querySQL);

    // Criamos um mapa { 'id_do_filme': '4.5' } para cruzar os dados de forma rápida
    const mapaMedias = {};
    resultadoPostgres.rows.forEach(row => {
      mapaMedias[row.conteudo_id] = row.media;
    });

    // 3. Mescla os dados: injeta a média do Postgres dentro de cada item do Mongoose
    const conteudosComNotasReais = conteudos.map(item => {
      // Converte o documento do Mongoose para um objeto JavaScript comum
      const itemObjeto = item.toObject();
      
      // Associa a média encontrada ou define '0.0' se o título não tiver avaliações
      itemObjeto.nota_media = mapaMedias[item._id.toString()] || '0.0';
      
      return itemObjeto;
    });

    // Envia a lista completa e atualizada para o Frontend
    res.json(conteudosComNotasReais);
  } catch (err) {
    console.error('Erro ao buscar conteúdos com médias:', err);
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
    // 1. SALVA NO POSTGRES (Como você já tinha feito)
    const result = await pool.query(
      `INSERT INTO avaliacoes 
       (usuario_id, conteudo_id, titulo_conteudo, tipo, nota, comentario)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [usuarioId, conteudoId, tituloConteudo, tipo, nota, comentario]
    );

    // 2. === NOVA PARTE: SALVANDO NO NEO4J ===
    try {
      const session = neo4jDriver.session();
      
      const query = `
        MERGE (u:Usuario {id: $usuarioId})
        MERGE (c:Conteudo {id: $conteudoId, titulo: $tituloConteudo})
        MERGE (u)-[r:AVALIOU]->(c)
        SET r.nota = $nota
      `;
      
      await session.run(query, {
        usuarioId: Number(usuarioId),
        conteudoId: String(conteudoId),
        tituloConteudo: String(tituloConteudo),
        nota: Number(nota)
      });
      
      await session.close();
      console.log('✅ Avaliação espelhada no Neo4j com sucesso!');
    } catch (neoError) {
      // Se o Neo4j falhar, a gente só avisa no terminal, mas não quebra o site
      console.error('❌ Erro ao salvar no Neo4j:', neoError);
    }
    // =====================================

    // 3. RESPONDE AO FRONTEND
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
// ==========================================
// ROTA DE RECOMENDAÇÕES (NEO4J)
// ==========================================
app.get('/recomendacoes/:conteudoId', async (req, res) => {
  const { conteudoId } = req.params;

  const session = neo4jDriver.session();

  try {
    // A mágica do Cypher: Filtragem Colaborativa
    const query = `
      MATCH (c:Conteudo {id: $conteudoId})<-[:AVALIOU]-(outroUsuario:Usuario)-[:AVALIOU]->(recomendacao:Conteudo)
      WHERE recomendacao.id <> $conteudoId
      RETURN recomendacao.titulo AS titulo, count(outroUsuario) AS forca
      ORDER BY forca DESC
      LIMIT 3
    `;

    const result = await session.run(query, { conteudoId: String(conteudoId) });

    // Transformando a resposta bizarra do Neo4j em um array simples para o Frontend
    const recomendacoes = result.records.map(record => ({
      titulo: record.get('titulo'),
      forca: record.get('forca').toNumber() // Quantas pessoas em comum avaliaram
    }));

    res.json(recomendacoes);
  } catch (error) {
    console.error('Erro ao buscar recomendações no Neo4j:', error);
    res.status(500).json({ error: 'Erro no motor de recomendações' });
  } finally {
    await session.close();
  }
});

app.listen(3001, '0.0.0.0', () => {
  console.log('Backend rodando na porta 3001');
});