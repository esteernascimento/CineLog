const neo4j = require('neo4j-driver');

// Substitua 'password123' pela senha que você colocou no seu docker-compose.yml
const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'password123';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// Função apenas para testar se a conexão deu certo quando o servidor ligar
async function testarConexaoNeo4j() {
  try {
    const serverInfo = await driver.getServerInfo();
    console.log('✅ Conectado ao Neo4j com sucesso!');
    console.log('Agente do Servidor:', serverInfo.agent);
  } catch (error) {
    console.error('❌ Erro ao conectar no Neo4j:', error.message);
  }
}

testarConexaoNeo4j();

module.exports = driver;