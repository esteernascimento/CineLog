import { useState } from 'react'
import './App.css'

function App() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  // Função que envia os dados para o Backend
  const handleCadastro = async (e) => {
    e.preventDefault(); // Evita que a página recarregue
    
    try {
      // Usando a URL pública do seu Backend no Codespaces
      const response = await fetch('https://silver-train-6j7rx6q94x73r4q5-3001.app.github.dev/auth/signup', {
        method: 'POST', // <-- Correção principal aqui!
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Sucesso! Usuário ${data.nome} cadastrado no PostgreSQL.`);
        // Limpa os campos da tela depois de cadastrar
        setNome('');
        setEmail('');
        setSenha('');
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      alert('Erro de conexão. O servidor Backend está rodando?');
    }
  };

  return (
    <div className="App">
      <h1>🎬 CineLog</h1>
      <h2>Cadastro de Usuário</h2>
      
      <form onSubmit={handleCadastro}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ padding: '8px', width: '200px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '8px', width: '200px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ padding: '8px', width: '200px' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Registrar
        </button>
      </form>
    </div>
  )
}

export default App