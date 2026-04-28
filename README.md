🚚 Logística Real-Time (Rastreio em Tempo Real)
Uma plataforma Fullstack de logística construída para suportar o rastreamento de entregas em tempo real. Este projeto foi desenhado focando em performance, comunicação bidirecional e tratamento de dados geográficos usando SQL puro integrado ao ORM.

✨ Arquitetura e Funcionalidades
Rastreamento em Tempo Real (WebSockets): Utilização do Socket.io para abrir túneis de comunicação direta entre os motoristas e o painel administrativo, eliminando a necessidade de polling e economizando recursos do servidor.

Geolocalização Avançada (PostGIS): Em vez de salvar coordenadas como texto ou números simples, o banco de dados utiliza a extensão PostGIS. O backend faz a conversão de Latitude/Longitude para pontos geométricos padrão mapa (SRID 4326) através do Prisma $queryRaw.

Segurança e Autenticação (JWT): Rotas administrativas protegidas por Middlewares que validam JSON Web Tokens, garantindo que apenas operadores logados tenham acesso ao painel de rastreio.

Estado Global Descomplicado (Zustand): Gerenciamento do estado da aplicação e dados do operador logado no React feito com Zustand, mantendo o código limpo e livre de boilerplates.

Mapas Interativos (Leaflet): Renderização de mapas dinâmicos e de código aberto direto no painel, reagindo instantaneamente aos eventos do WebSocket.

🛠️ Tecnologias Utilizadas
Backend:

Node.js + Express

TypeScript

Prisma ORM (com PrismaPg Adapter)

PostgreSQL + Extensão PostGIS (Docker)

Socket.io (Servidor)

Bcryptjs & JsonWebToken (JWT)

Frontend:

React + Vite

TypeScript

Tailwind CSS

Zustand (State Management)

React Router DOM

React Leaflet (Mapas)

Socket.io-client

🚀 Como Executar o Projeto
Pré-requisitos
Node.js (v20+)

Docker e Docker Compose (para subir o banco de dados espacial)

1. Backend
Bash
# Clone o repositório
git clone https://github.com/seu-usuario/logistica-api.git

# Acesse a pasta do backend
cd logistica-api

# Instale as dependências
npm install

# Suba o banco de dados com Docker
docker-compose up -d

# Rode as migrations para criar as tabelas
npx prisma migrate dev

# Inicie o servidor em modo de desenvolvimento
npm run dev
2. Frontend
Bash
# Clone o repositório do frontend (se estiver em outro repositório)
git clone https://github.com/seu-usuario/logistica-web.git

# Acesse a pasta do frontend
cd logistica-web

# Instale as dependências
npm install

# Inicie o Vite
npm run dev
O servidor da API rodará na porta 3333 e o painel Frontend estará disponível no seu localhost (geralmente porta 5173).
