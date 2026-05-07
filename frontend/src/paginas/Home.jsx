import { useEffect, useState } from 'react'

function Home({
  usuarioLogado,
  usuarioId,
  setTela,
  setConteudoSelecionado
}) {
  const [conteudos, setConteudos] = useState([])
  const [busca, setBusca] = useState('')
  const [aba, setAba] = useState('filme')

  const BACKEND_URL =
    'https://orange-eureka-v6q66pwp67grfp75g-3001.app.github.dev'

  useEffect(() => {
    buscarConteudos()
  }, [])

  const buscarConteudos = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/conteudos`)
      const data = await response.json()
      setConteudos(data)
    } catch (error) {
      console.error('Erro ao buscar conteúdos:', error)
    }
  }

  const conteudosFiltrados = conteudos.filter((item) => {
    const correspondeTipo = item.tipo === aba
    const titulo = item.titulo || ''
    const correspondeBusca = titulo
      .toLowerCase()
      .includes(busca.toLowerCase())

    return correspondeTipo && correspondeBusca
  })

  return (
    <div className="home-container">
      <header className="home-header">
        <div>
          <h1>CineLog</h1>
          <p>Bem-vindo(a), {usuarioLogado}</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setTela('perfil')}
            className="btn-sair"
          >
            Perfil
          </button>

          <button
            onClick={() => setTela('login')}
            className="btn-sair"
          >
            Sair
          </button>
        </div>
      </header>

      <section className="home-card">
        <input
          type="text"
          placeholder="Pesquisar filmes e séries..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="search-input"
        />

        <div className="tabs">
          <button
            className={aba === 'filme' ? 'tab-active' : 'tab'}
            onClick={() => setAba('filme')}
          >
            Filmes
          </button>

          <button
            className={aba === 'serie' ? 'tab-active' : 'tab'}
            onClick={() => setAba('serie')}
          >
            Séries
          </button>
        </div>

        <div className="content-grid">
          {conteudosFiltrados.map((item) => (
            <div className="content-card" key={item._id}>
              <h3>{item.titulo}</h3>

              <span>{item.ano}</span>

              <p className="genres">
                {item.generos?.join(', ')}
              </p>

              <p className="sinopse">
                {item.sinopse}
              </p>

              <button
                className="btn-primary"
                onClick={() => {
                  setConteudoSelecionado(item)
                  setTela('avaliacao')
                }}
              >
                Ver detalhes
              </button>
            </div>
          ))}
        </div>

        {conteudosFiltrados.length === 0 && (
          <p className="empty-message">
            Nenhum conteúdo encontrado.
          </p>
        )}
      </section>
    </div>
  )
}

export default Home