# 🎬 CineLog - Seu Diário de Entretenimento 

> Projeto acadêmico focado em persistência poliglota e arquitetura de dados.

## 📌 1. Explicação do Tema Escolhido
O **CineLog** é uma plataforma de registro e avaliação de entretenimento (filmes e séries). O objetivo do sistema é permitir que os usuários explorem um catálogo de conteúdos, criem contas, registrem suas opiniões (notas e críticas) sobre as obras assistidas e, com base no histórico da comunidade, recebam recomendações personalizadas. 

O tema foi escolhido por permitir a exploração de diferentes estruturas de dados na prática: catálogos flexíveis (documentos), registros transacionais rigorosos (tabelas relacionais) e redes de relacionamento complexas (grafos).

---

## 🗄️ 2. Arquitetura do Backend e Justificativa dos Bancos de Dados

### Definição de Implementação do Backend
O backend foi desenvolvido utilizando **Node.js** com o framework **Express.js**, expondo uma API RESTful. Ele atua como o orquestrador central da arquitetura de Persistência Poliglota, recebendo as requisições do frontend (React) e gerenciando a comunicação com os três bancos de dados de forma simultânea através de bibliotecas nativas (`mongoose`, `pg` e `neo4j-driver`). 

A implementação foca em dois pilares:
1. **Segurança:** As rotas de autenticação implementam a biblioteca `bcrypt` para gerar o *hash* criptográfico das senhas em memória antes de persistir qualquer dado de usuário.
2. **Integração de Dados (Join a nível de Aplicação):** Como os bancos de dados não se comunicam diretamente entre si, o backend assume o papel de "middleware de junção". Nas listagens do catálogo, por exemplo, a API busca os detalhes em documento no MongoDB e cruza em tempo real com a média matemática das notas calculadas pelo PostgreSQL, devolvendo um pacote de dados unificado para o cliente. As lógicas de recomendação disparam *queries* em Cypher diretamente do Node.js para o motor de grafos.

### Justificativa dos Bancos de Dados

#### 🟢 MongoDB (Orientado a Documentos)
* **Uso no projeto:** Armazenamento do catálogo de filmes e séries.
* **Justificativa:** Conteúdos de entretenimento possuem esquemas altamente mutáveis (um filme pode ter vários diretores, séries têm temporadas, gêneros variam). O formato JSON/BSON do MongoDB permite armazenar essas listas e arrays de forma natural e flexível, sem a necessidade de tabelas auxiliares (JOINs) complexas apenas para exibir o catálogo.

#### 🔵 PostgreSQL (Relacional)
* **Uso no projeto:** Gerenciamento de usuários (autenticação) e histórico de avaliações.
* **Justificativa:** Dados transacionais e de identidades exigem forte consistência (ACID) e integridade referencial. O PostgreSQL garante que não haverá e-mails duplicados no cadastro e que uma avaliação sempre estará vinculada a um usuário real, fornecendo segurança e padronização matemática para as transações principais da aplicação.

#### 🟣 Neo4j (Orientado a Grafos)
* **Uso no projeto:** Motor de Recomendações (Filtragem Colaborativa).
* **Justificativa:** Para responder à pergunta *"Pessoas que gostaram deste filme também assistiram o quê?"*, bancos relacionais exigiriam queries lentas e custosas com múltiplos JOINs na mesma tabela. O Neo4j modela isso nativamente como nós (`Usuario` e `Conteudo`) conectados por arestas (`AVALIOU`). A travessia de grafos torna a recomendação extremamente rápida, independentemente do volume de dados.

---

## 🛠️ 3. Recursos Necessários
Para executar este projeto em um ambiente "limpo" (sem execuções prévias), os seguintes recursos e serviços são necessários:

* **Docker & Docker Compose:** Para orquestração dos contêineres dos bancos de dados.
* **Node.js (v18+):** Para execução do backend e frontend.
* **Gerenciador de pacotes (npm):** Para instalação das dependências.
* **Serviços rodando via Docker:**
  * Imagem `postgres:latest` (Porta 5432)
  * Imagem `mongo:latest` (Porta 27017)
  * Imagem `neo4j:latest` (Portas 7474 e 7687)

---

## 🚀 4. Como Executar o Projeto

Siga o passo a passo abaixo para rodar a aplicação localmente:

### Passo 1: Subir a Infraestrutura de Dados
Na raiz do projeto (onde está localizado o arquivo `docker-compose.yml`), abra o terminal e execute:
```bash
docker-compose up -d
````
## Passo 2: Configurar o Backend
Abra um terminal na pasta do backend:
```bash
cd backend
npm install
````
(Opcional) Crie um arquivo .env na pasta backend com suas credenciais de banco, caso não esteja usando as senhas padrão do docker-compose.
Inicie o servidor Node.js:
```bash
node index.js
# O servidor rodará na porta 3001
```
## Passo 3: Configurar o Frontend
Abra um novo terminal na pasta do frontend:
```bash
cd frontend
npm install
npm run dev
```
## Passo 4: Acessar a Aplicação
Abra o navegador e acesse a URL fornecida pelo Vite (geralmente http://localhost:5173). O backend estará respondendo em http://localhost:3001.

Observações: Lembre-se de mudar o link do seu backend caso esteja usando o codespaces e deixar a porta 3001 publica.
