import { useEffect, useState } from 'react'

function Perfil({ usuarioLogado, usuarioId, setTela }) {
  const [avaliacoes, setAvaliacoes] = useState([])

  const BACKEND_URL =
    'https://orange-eureka-v6q66pwp67grfp75g-3001.app.github.dev'

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
      <header className="home-header">
        <div>
          <h1>Meu Perfil</h1>
          <p>{usuarioLogado}</p>
        </div>

        <button onClick={() => setTela('home')} className="btn-sair">
          Voltar
        </button>
      </header>

      <section className="home-card">
        <h2>Minhas avaliações</h2>

        {avaliacoes.length === 0 && (
          <p className="empty-message">
            Você ainda não fez nenhuma avaliação.
          </p>
        )}

        <div className="content-grid">
          {avaliacoes.map((avaliacao) => (
            <div className="content-card" key={avaliacao.id}>
              <h3>{avaliacao.titulo_conteudo}</h3>

              <p>
                <strong>Tipo:</strong> {avaliacao.tipo}
              </p>

              <p>
                <strong>Nota:</strong>{' '}
                {'★'.repeat(avaliacao.nota)}
                {'☆'.repeat(5 - avaliacao.nota)}
              </p>

              <p className="sinopse">
                {avaliacao.comentario || 'Sem comentário.'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Perfil