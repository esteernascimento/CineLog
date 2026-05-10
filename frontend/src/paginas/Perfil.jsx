import { useEffect, useState } from 'react'

function Perfil({ usuarioLogado, usuarioId, setTela }) {
  const [avaliacoes, setAvaliacoes] = useState([])

  const BACKEND_URL =
    'https://probable-barnacle-wwj9q6prvxrfv45p-3001.app.github.dev'

  useEffect(() => {
    buscarAvaliacoes()
  }, [])

  const buscarAvaliacoes = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/avaliacoes/${usuarioId}`)
      const data = await response.json()
      setAvaliacoes(data)
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error)
    }
  }

  return (
    <div className="home-container">
      {/* HEADER PADRONIZADO */}
      <header>
        <div className="header-info">
          <h1 className="logo" onClick={() => setTela('home')} style={{ cursor: 'pointer' }}>
            CineLog
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Perfil de <strong>{usuarioLogado}</strong>
          </p>
        </div>

        <button onClick={() => setTela('home')} className="btn-secondary">
          Voltar ao Catálogo
        </button>
      </header>

      <main style={{ padding: '40px 5%' }}>
        {/* TÍTULO DA PÁGINA EM ROSA */}
        <div className="profile-header" style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase' }}>
            Minhas Avaliações
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>
            Você já registrou {avaliacoes.length} títulos no seu diário.
          </p>
        </div>

        {/* CASO NÃO TENHA AVALIAÇÕES */}
        {avaliacoes.length === 0 && (
          <div className="placeholder-box" style={{ textAlign: 'center', padding: '60px', border: '1px dashed #444', borderRadius: '12px' }}>
            <p style={{ color: 'var(--text-muted)' }}>Você ainda não fez nenhuma avaliação. Que tal começar agora?</p>
            <button onClick={() => setTela('home')} className="btn-primary" style={{ marginTop: '20px' }}>
              Explorar Catálogo
            </button>
          </div>
        )}

        {/* GRADE DE AVALIAÇÕES (POSTGRESQL) */}
        <div className="movie-grid">
          {avaliacoes.map((avaliacao) => (
            <div className="movie-card review-card" key={avaliacao.id} style={{ height: 'auto', padding: '20px' }}>
              <div className="movie-info">
                <span className="category-tag" style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {avaliacao.tipo}
                </span>
                
                {/* TÍTULO DO FILME EM ROSA */}
                <h3 style={{ color: 'var(--primary)', fontSize: '1.4rem', margin: '10px 0', fontWeight: '800' }}>
                  {avaliacao.titulo_conteudo}
                </h3>

                <div className="stars-display" style={{ color: 'var(--primary)', fontSize: '1.2rem', marginBottom: '15px' }}>
                  {'★'.repeat(avaliacao.nota)}
                  <span style={{ color: '#333' }}>{'★'.repeat(5 - avaliacao.nota)}</span>
                </div>

                <p className="comment-text" style={{ 
                  fontSize: '0.95rem', 
                  color: '#eee', 
                  fontStyle: 'italic',
                  lineHeight: '1.5',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  paddingTop: '15px'
                }}>
                  "{avaliacao.comentario || 'Sem comentário.'}"
                </p>
                
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '15px' }}>
                  Avaliado em: {new Date(avaliacao.criado_em).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Perfil