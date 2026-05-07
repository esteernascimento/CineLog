import { useState } from 'react'

function Avaliacao({ conteudoSelecionado, usuarioId, setTela }) {
  const [notaSelecionada, setNotaSelecionada] = useState(0)
  const [comentario, setComentario] = useState('')

  const BACKEND_URL =
    'https://orange-eureka-v6q66pwp67grfp75g-3001.app.github.dev'

  const salvarAvaliacao = async () => {
    if (!notaSelecionada) {
      alert('Selecione uma nota antes de salvar')
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/avaliacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
        alert('Avaliação salva com sucesso')
        setTela('perfil')
      } else {
        alert('Erro ao salvar avaliação')
      }
    } catch (error) {
      console.error(error)
      alert('Erro de conexão')
    }
  }

  if (!conteudoSelecionado) {
    return (
      <div className="home-container">
        <section className="home-card">
          <p>Nenhum conteúdo selecionado.</p>

          <button onClick={() => setTela('home')} className="btn-primary">
            Voltar
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div>
          <h1>CineLog</h1>
          <p>Avaliação</p>
        </div>

        <button onClick={() => setTela('home')} className="btn-sair">
          Voltar
        </button>
      </header>

      <section className="home-card">
        <h2>{conteudoSelecionado.titulo}</h2>

        <p>
          <strong>Tipo:</strong> {conteudoSelecionado.tipo}
        </p>

        <p>
          <strong>Ano:</strong> {conteudoSelecionado.ano}
        </p>

        <p>
          <strong>Gêneros:</strong>{' '}
          {conteudoSelecionado.generos?.join(', ')}
        </p>

        <p className="sinopse">
          {conteudoSelecionado.sinopse}
        </p>

        <h3>Minha nota</h3>

        <div className="stars">
          {[1, 2, 3, 4, 5].map((nota) => (
            <span
              key={nota}
              onClick={() => setNotaSelecionada(nota)}
              className={
                nota <= notaSelecionada ? 'star active' : 'star'
              }
            >
              ★
            </span>
          ))}
        </div>

        <h3>Minha avaliação</h3>

        <textarea
          placeholder="Escreva o que você achou..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="comentario-input"
        />

        <button onClick={salvarAvaliacao} className="btn-primary">
          Salvar avaliação
        </button>

        <div className="recomendacoes-box">
          <h3>Recomendações</h3>
          <p>As recomendações serão exibidas aqui futuramente.</p>
        </div>
      </section>
    </div>
  )
}

export default Avaliacao