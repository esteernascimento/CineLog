import { useState } from 'react'
import './App.css'

function App() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      // LEMBRE-SE: Use a sua URL pública do Codespaces aqui
      const response = await fetch('https://silver-train-6j7rx6q94x73r4q5-3001.app.github.dev/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`🎬 Luz, câmera, ação! Bem-vindo, ${data.nome}`);
        setNome(''); setEmail(''); setSenha('');
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      alert('Erro de conexão. O servidor Backend está rodando?');
    }
  };

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
      </div>
    </div>
  )
}

export default App