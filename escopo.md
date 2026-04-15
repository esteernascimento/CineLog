# 🎬 CineLog

## 🎯 Objetivo
O CineLog é uma plataforma onde usuários podem registrar, avaliar e receber recomendações de filmes e séries, funcionando como um diário pessoal de entretenimento.

---

## ✅ Funcionalidades obrigatórias

### 🔐 1. Autenticação de usuário
- Cadastro de novos usuários
- Login com email e senha
- Validação de dados
- Armazenamento seguro da senha (hash)

---

### 🔎 2. Pesquisa de conteúdos
- Buscar filmes e séries pelo nome
- Exibir lista de resultados
- Diferenciar filme de série

---

### 📄 3. Visualização de detalhes
- Exibir informações do conteúdo:
  - Título
  - Tipo (filme ou série)
  - Gênero
  - Ano
  - Sinopse
  - Temporadas (se série)

---

### ⭐ 4. Avaliação de conteúdos
- Usuário pode dar nota para filmes e séries
- Salvar avaliação associada ao usuário
- Impedir avaliações inválidas

---

### 📘 5. Diário do usuário
- Listar conteúdos já avaliados
- Mostrar nota dada
- Visualizar histórico de avaliações

---

### 🤖 6. Sistema de recomendação
- Sugerir conteúdos com base nas avaliações do usuário
- Considerar gêneros ou conteúdos semelhantes
- Exibir lista de recomendações

---

## 🧠 Uso dos bancos de dados

### 🐘 PostgreSQL
- Armazenar usuários (email, senha)

### 🍃 MongoDB
- Armazenar filmes e séries
- Estrutura flexível para diferentes tipos de conteúdo

### 🔗 Neo4j
- Armazenar relações:
  - Usuário → avaliou → conteúdo
  - Conteúdo → pertence a → gênero
- Gerar recomendações

---



## 📱 Telas do sistema
- Login / Cadastro  
- Home (pesquisa)  
- Detalhes do conteúdo  
- Diário (avaliações)  
- Recomendações  

---

## 🔄 Fluxo principal do sistema

1. Usuário faz cadastro ou login  
2. Acessa a tela inicial  
3. Pesquisa um filme ou série  
4. Visualiza detalhes  
5. Dá uma nota  
6. Sistema registra a avaliação  
7. Sistema gera recomendações  
8. Usuário visualiza seu diário e sugestões  
