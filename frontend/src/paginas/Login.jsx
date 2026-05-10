function Login({ onLogin, mudarTela, email, setEmail, senha, setSenha }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🎬</span>
          <h1 className="logo">CineLog</h1>
          <p className="auth-subtitle">Seu diário de entretenimento</p>
        </div>

        <form onSubmit={onLogin} className="auth-form">
          <h2>Entrar na sua conta</h2>
          
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

          <button type="submit" className="btn-primary full-width">
            Entrar
          </button>
        </form>

        <div className="auth-footer">
          <p>Ainda não faz parte?</p>
          <button onClick={() => mudarTela('cadastro')} className="btn-link">
            Criar conta agora
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login