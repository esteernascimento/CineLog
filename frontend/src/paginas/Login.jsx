function Login({ onLogin, mudarTela, email, setEmail, senha, setSenha }) {
  return (
    <div className="container">
      <div className="auth-card">
        <div className="icon-header">🎬</div>
        <h1>CineLog</h1>
        <h2>Entrar na sua conta</h2>

        <form onSubmit={onLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Entrar
          </button>
        </form>

        <button onClick={() => mudarTela('cadastro')} className="btn-secondary">
          Não tenho conta
        </button>
      </div>
    </div>
  )
}

export default Login