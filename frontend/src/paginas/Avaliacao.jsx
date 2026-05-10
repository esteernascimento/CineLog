import { useState } from 'react'

function Avaliacao({ conteudoSelecionado, usuarioId, setTela }) {
  const [notaSelecionada, setNotaSelecionada] = useState(0)
  const [comentario, setComentario] = useState('')

  const BACKEND_URL = 'https://probable-barnacle-wwj9q6prvxrfv45p-3001.app.github.dev'

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

        <section className="recommendations-placeholder">
          <h3>Porque você viu {conteudoSelecionado.titulo}...</h3>
          <div className="placeholder-box">
            <p>🔮 <strong>Em breve:</strong> Recomendações personalizadas via Neo4j.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Avaliacao