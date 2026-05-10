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
    'https://probable-barnacle-wwj9q6prvxrfv45p-3001.app.github.dev'

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
      {/* HEADER PROFISSIONAL */}
      <header>
        <div className="header-info">
          <h1 className="logo">CineLog</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Bem-vindo(a), <strong>{usuarioLogado}</strong>
          </p>
        </div>

        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setTela('perfil')} className="btn-secondary">
            Perfil
          </button>
          <button onClick={() => setTela('login')} className="btn-primary" style={{ padding: '8px 20px' }}>
            Sair
          </button>
        </div>
      </header>

      <main style={{ padding: '40px 5%' }}>
        {/* BARRA DE PESQUISA */}
        <div className="search-container" style={{ marginBottom: '40px', textAlign: 'center' }}>
          <input
            type="text"
            placeholder="Pesquisar títulos no catálogo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="search-input"
          />
        </div>

        {/* SELETOR DE ABAS (FILMES / SÉRIES) */}
        <div className="tabs" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button
            className={aba === 'filme' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setAba('filme')}
          >
            Filmes
          </button>
          <button
            className={aba === 'serie' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setAba('serie')}
          >
            Séries
          </button>
        </div>

        {/* GRADE DE CONTEÚDOS (SEM IMAGEM) */}
        <div className="movie-grid">
          {conteudosFiltrados.map((item) => (
            <div 
              className="movie-card no-image" 
              key={item._id}
              onClick={() => {
                setConteudoSelecionado(item)
                setTela('avaliacao')
              }}
            >
              <div className="movie-icon-wrapper">
                <span className="movie-icon">🎬</span>
              </div>
              
              <div className="movie-info">
                <h3>{item.titulo}</h3>
                <div className="movie-meta" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.ano}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>★ {item.nota_media || '0.0'}</span>
                </div>
                <p className="genres" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {item.generos?.slice(0, 2).join(' • ')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* MENSAGEM CASO NÃO ENCONTRE NADA */}
        {conteudosFiltrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
            <p>Nenhum título encontrado nesta categoria.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Home