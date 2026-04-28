function Home({ usuarioLogado, setTela }) {
  return (
    <div className="container">
      <div className="auth-card">
        <div className="icon-header">🎬</div>
        <h1>CineLog</h1>
        <h2>Bem-vindo(a), {usuarioLogado}</h2>

        <p>HOME.</p>

        <button onClick={() => setTela('login')} className="btn-primary">
          Sair
        </button>
      </div>
    </div>
  )
}

export default Home