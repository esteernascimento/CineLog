import { useState } from 'react'
import Login from './paginas/Login'
import Home from './paginas/Home'
import Avaliacao from './paginas/Avaliacao'
import Perfil from './paginas/Perfil'
import './App.css'

function App() {
  const [tela, setTela] = useState('cadastro')

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const [usuarioLogado, setUsuarioLogado] = useState('')
  const [usuarioId, setUsuarioId] = useState(null)

  const [conteudoSelecionado, setConteudoSelecionado] =
    useState(null)

  const BACKEND_URL =
    'https://orange-eureka-v6q66pwp67grfp75g-3001.app.github.dev'

  const handleCadastro = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome,
          email,
          senha
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert(
          `Cadastro realizado com sucesso, ${data.nome}. Faça login agora.`
        )

        setNome('')
        setEmail('')
        setSenha('')
        setTela('login')
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error) {
      alert(`Erro de conexão: ${error.message}`)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          senha
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Login realizado com sucesso')

        setUsuarioLogado(data.user)
        setUsuarioId(data.usuarioId)

        setEmail('')
        setSenha('')

        setTela('home')
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error) {
      alert(`Erro de conexão: ${error.message}`)
    }
  }

  if (tela === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        mudarTela={setTela}
        email={email}
        setEmail={setEmail}
        senha={senha}
        setSenha={setSenha}
      />
    )
  }

  if (tela === 'home') {
    return (
      <Home
        usuarioLogado={usuarioLogado}
        usuarioId={usuarioId}
        setTela={setTela}
        setConteudoSelecionado={setConteudoSelecionado}
      />
    )
  }

  if (tela === 'avaliacao') {
    return (
      <Avaliacao
        conteudoSelecionado={conteudoSelecionado}
        usuarioId={usuarioId}
        setTela={setTela}
      />
    )
  }

  if (tela === 'perfil') {
    return (
      <Perfil
        usuarioLogado={usuarioLogado}
        usuarioId={usuarioId}
        setTela={setTela}
      />
    )
  }

  return (
    <div className="container">
      <div className="auth-card">
        <div className="icon-header">🎬</div>

        <h1>CineLog</h1>

        <h2>Seu diário de entretenimento</h2>

        <form onSubmit={handleCadastro}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Nome de usuário"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

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
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Cadastrar
          </button>
        </form>

        <button
          onClick={() => setTela('login')}
          className="btn-secondary"
        >
          Já tenho conta
        </button>
      </div>
    </div>
  )
}

export default App