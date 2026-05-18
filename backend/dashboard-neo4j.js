const neo4j = require('neo4j-driver');

// Conectando direto no cabo de força
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'password123'));

async function verOQueTemNoGrafo() {
  const session = driver.session();
  try {
    console.log("⏳ Vasculhando o Neo4j...\n");
    const result = await session.run('MATCH (n) RETURN labels(n)[0] AS tipo, properties(n) AS dados');
    
    if (result.records.length === 0) {
      console.log("❌ O banco está VAZIO! As avaliações não estão chegando no Neo4j.");
    } else {
      console.log("✅ DADOS ENCONTRADOS NO GRAFO:");
      result.records.forEach(record => {
        console.log(`➡️  Nó: ${record.get('tipo')} | Dados:`, record.get('dados'));
      });
    }
  } catch (erro) {
    console.log("🚨 ERRO DE CONEXÃO. O Node.js não está conseguindo falar com o Docker.");
    console.log(erro.message);
  } finally {
    await session.close();
    process.exit(0);
  }
}

verOQueTemNoGrafo();