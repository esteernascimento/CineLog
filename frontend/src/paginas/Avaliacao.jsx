import { useState, useEffect } from 'react'

function Avaliacao({ conteudoSelecionado, usuarioId, setTela }) {
  const [notaSelecionada, setNotaSelecionada] = useState(0)
  const [comentario, setComentario] = useState('')
  // NOVO: Estado para guardar as recomendações que vêm do Neo4j
  const [recomendacoes, setRecomendacoes] = useState([])

  const BACKEND_URL = 'https://probable-barnacle-wwj9q6prvxrfv45p-3001.app.github.dev'

  // NOVO: Busca as recomendações assim que a tela abre ou o filme muda
  useEffect(() => {
    if (conteudoSelecionado) {
      buscarRecomendacoes()
    }
  }, [conteudoSelecionado])

  const buscarRecomendacoes = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/recomendacoes/${conteudoSelecionado._id}`)
      if (res.ok) {
        const data = await res.json()
        setRecomendacoes(data)
      }
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error)
    }
  }

  const salvarAvaliacao = async () => {
    if (!notaSelecionada) {
      alert('Selecione uma nota antes de salvar')
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/avaliacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId,
          conteudoId: conteudoSelecionado._id,
          tituloConteudo: conteudoSelecionado.titulo,
          tipo: conteudoSelecionado.tipo,
          nota: notaSelecionada,
          comentario
        })
      })

      if (response.ok) {
        alert('Avaliação salva com sucesso!')
        setTela('home')
      } else {
        alert('Erro ao salvar avaliação')
      }
    } catch (error) {
      console.error(error)
      alert('Erro de conexão')
    }
  }

  if (!conteudoSelecionado) return null;

  return (
    <div className="home-container">
      <header>
        <div className="header-info">
          <h1 className="logo" onClick={() => setTela('home')}>CineLog</h1>
          <p className="subtitle">Avaliação de Conteúdo</p>
        </div>
        <button onClick={() => setTela('home')} className="btn-secondary">Voltar</button>
      </header>

      <main className="avaliacao-main">
        <section className="detail-card">
          
          <div className="detail-header">
             <span className="category-tag">{conteudoSelecionado.tipo} • {conteudoSelecionado.ano}</span>
             <h2 className="detail-title">{conteudoSelecionado.titulo}</h2>
             <p className="detail-genres">{conteudoSelecionado.generos?.join(' • ')}</p>
          </div>

          <div className="sinopse-box">
            <p>"{conteudoSelecionado.sinopse}"</p>
          </div>

          <div className="rating-form">
            <h3>Sua nota</h3>
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((nota) => (
                <span
                  key={nota}
                  onClick={() => setNotaSelecionada(nota)}
                  className={nota <= notaSelecionada ? 'star active' : 'star'}
                >
                  ★
                </span>
              ))}
            </div>

            <h3>O que você achou?</h3>
            <textarea
              placeholder="Escreva sua crítica aqui..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="avaliacao-textarea"
            />

            <button onClick={salvarAvaliacao} className="btn-primary full-width">
              Confirmar Avaliação
            </button>
          </div>
        </section>

        {/* NOVA SEÇÃO: Exibição dinâmica das recomendações */}
        <section className="recommendations-container" style={{ marginTop: '40px' }}>
          <h3 style={{ marginBottom: '20px', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '1.2rem' }}>
            Porque você viu {conteudoSelecionado.titulo}...
          </h3>
          
          {recomendacoes.length > 0 ? (
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {recomendacoes.map((rec, index) => (
                <div key={index} style={{ 
                  flex: '1 1 200px', 
                  background: 'var(--bg-card)', 
                  padding: '20px', 
                  borderRadius: '12px',
                  borderLeft: '4px solid var(--primary)'
                }}>
                  <h4 style={{ color: 'white', marginBottom: '8px', fontSize: '1.1rem' }}>{rec.titulo}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Recomendado por {rec.forca} usuário(s) com gostos parecidos
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed #444' }}>
              <p style={{ color: 'var(--text-muted)' }}>
                Nenhuma recomendação ainda. Seja o primeiro a criar conexões para este título!
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Avaliacao