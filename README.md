# Cognitio AI - Plataforma de Estudos com IA

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![React](https://img.shields.io/badge/react-19.1.1-blue.svg)
![Fastify](https://img.shields.io/badge/fastify-5.6.1-black.svg)

**Uma plataforma inteligente de estudos que transforma seus materiais em experiências interativas de aprendizagem usando IA.**

[Características](#-características) •
[Tecnologias](#-tecnologias) •
[Instalação](#-instalação) •
[Uso](#-uso) •
[Arquitetura](#-arquitetura) •
[Contribuindo](#-contribuindo)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Características](#-características)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Banco de Dados](#-banco-de-dados)
- [Autenticação e Segurança](#-autenticação-e-segurança)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Autores](#-autores)

---

## 🎯 Sobre o Projeto

**Cognitio AI** é uma plataforma educacional completa que utiliza inteligência artificial para transformar materiais de estudo em conteúdo interativo. O sistema gera automaticamente resumos detalhados, flashcards com repetição espaçada (algoritmo SM-2) e quizzes de múltipla escolha a partir de textos, PDFs, documentos DOCX ou até mesmo imagens.

A plataforma foi desenvolvida como Trabalho de Conclusão de Curso (TCC) por Guilherme Viana e Fred Alisson, combinando tecnologias modernas de desenvolvimento web com os mais avançados modelos de IA.

### 🎓 Principais Diferenciais

- **IA Generativa Multi-Modelo**: Integração com Google Gemini e Groq com fallback automático
- **Repetição Espaçada**: Implementação do algoritmo SM-2 para otimizar a retenção de conhecimento
- **Análise de Múltiplos Formatos**: Processa textos, PDFs, DOCX e imagens (PNG, JPG)
- **Gamificação**: Sistema de metas diárias, estatísticas e ranking de usuários
- **Design Moderno**: Interface responsiva com suporte a modo escuro
- **Segurança Avançada**: Autenticação JWT com refresh tokens em httpOnly cookies

---

## ✨ Características

### 🤖 Geração Automática de Conteúdo

- **Resumos Inteligentes**: Conteúdo formatado em Markdown (600-8000 palavras)
- **Flashcards Personalizados**: 5-20 cartões com perguntas e respostas
- **Quizzes Adaptativos**: 10-15 questões de múltipla escolha com níveis de dificuldade

### 📚 Sistema de Materiais

- Upload de arquivos (PDF, DOCX, TXT, PNG, JPG - até 10MB)
- Criação via texto/tópico com geração automática de conteúdo
- Listagem paginada e busca
- Visualização de materiais recentes

### 🎴 Flashcards com Repetição Espaçada

- **Algoritmo SM-2**: Otimiza o agendamento de revisões
- **4 Níveis de Dificuldade**: "novamente", "difícil", "bom", "fácil"
- **Fator de Facilidade Adaptativo**: Ajuste dinâmico baseado no desempenho
- **Histórico de Revisões**: Acompanhe sua evolução
- **Sistema de Revisão**: Exibe apenas cartões que estão prontos para revisão

### 📝 Sistema de Quiz

- Questões de múltipla escolha com 4 alternativas
- Progresso por material com estatísticas
- Sessões de quiz com validação de respostas
- Histórico de tentativas com análise de desempenho
- Reset de progresso por material

### 🎯 Metas e Acompanhamento

- Definição de metas diárias (flashcards e quizzes)
- Área de interesse personalizável
- Dashboard com estatísticas detalhadas
- Gráficos de desempenho (Recharts)
- Calendário de atividades de estudo
- Sistema de streaks para gamificação

### 👥 Gestão de Usuários

- Registro e autenticação segura
- Perfis de usuário (estudante/admin)
- Onboarding para novos usuários
- Painel administrativo para gestão de usuários
- Soft delete (desativação de contas)

### 🎨 Experiência do Usuário

- Design responsivo (mobile-first)
- Modo escuro/claro
- Notificações toast (Sonner)
- Loading states e skeletons
- Lazy loading de rotas
- Landing page atrativa

---

## 🚀 Tecnologias

### Backend

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Node.js** | >=18 | Runtime JavaScript |
| **Fastify** | 5.6.1 | Framework web de alta performance |
| **TypeScript** | 5.9.3 | Superset JavaScript com tipagem estática |
| **Drizzle ORM** | 0.44.6 | ORM moderno e type-safe |
| **PostgreSQL** | - | Banco de dados relacional |
| **Vercel AI SDK** | 5.0.68 | Integração com modelos de IA |
| **Google Gemini** | 2.0.20 | Modelo de IA generativa |
| **Groq** | 2.0.29 | Provedor alternativo de IA |
| **JWT** | 10.0.0 | Autenticação via tokens |
| **Bcrypt.js** | 3.0.2 | Hash de senhas |
| **Zod** | 4.1.12 | Validação de schemas |
| **Vitest** | 3.2.4 | Framework de testes |
| **pdf-parse** | 2.2.9 | Extração de texto de PDFs |
| **mammoth** | 1.11.0 | Extração de texto de DOCX |

### Frontend

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **React** | 19.1.1 | Biblioteca UI |
| **Vite** | 7.1.6 | Build tool moderna |
| **TypeScript** | 5.8.3 | Superset JavaScript |
| **React Router** | 7.9.1 | Roteamento SPA |
| **TanStack Query** | 5.90.2 | Gerenciamento de estado servidor |
| **Axios** | 1.12.2 | Cliente HTTP |
| **Tailwind CSS** | 4.1.13 | Framework CSS utility-first |
| **Radix UI** | - | Componentes UI acessíveis |
| **Lucide React** | 0.544.0 | Biblioteca de ícones |
| **React Hook Form** | 7.63.0 | Gerenciamento de formulários |
| **Recharts** | 2.15.4 | Biblioteca de gráficos |
| **React Markdown** | 10.1.0 | Renderização de Markdown |
| **Sonner** | 2.0.7 | Sistema de notificações |
| **next-themes** | 0.4.6 | Gerenciamento de temas |

### DevOps e Ferramentas

- **Docker & Docker Compose**: Containerização do PostgreSQL
- **Biome**: Linter e formatter
- **tsup**: Bundler para produção (backend)
- **Drizzle Kit**: Gerenciamento de migrações
- **Supertest**: Testes de integração HTTP

---

## 🏗️ Arquitetura

### Backend - Arquitetura em Camadas

```
┌─────────────────────────────────────┐
│     Controllers (HTTP Layer)        │
│  - Validação de entrada (Zod)      │
│  - Tratamento de erros             │
│  - Serialização de resposta        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Services (Business Logic)     │
│  - Regras de negócio               │
│  - Orquestração de operações       │
│  - Integração com IA               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Repositories (Data Access)       │
│  - Interface abstrata              │
│  - Implementação Drizzle ORM       │
│  - Queries SQL type-safe           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Database (PostgreSQL)         │
│  - 9 tabelas principais            │
│  - Relacionamentos com FKs         │
│  - Índices para performance        │
└─────────────────────────────────────┘
```

#### Padrões de Design Implementados

1. **Repository Pattern**: Abstração da camada de dados
2. **Service Layer Pattern**: Lógica de negócio isolada
3. **Factory Pattern**: Criação de serviços com injeção de dependências
4. **Error Handling Pattern**: Classes de erro personalizadas
5. **Middleware Pattern**: Autenticação e autorização
6. **Fallback Strategy**: IA com múltiplos provedores

### Frontend - Arquitetura de Componentes

```
┌─────────────────────────────────────┐
│        Pages (Route Components)     │
│  - Dashboard, Materials, Quiz...   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Layouts (Shared Structure)     │
│  - AppLayout, AuthLayout           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Feature Components              │
│  - MaterialCard, FlashcardItem...  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    UI Components (Primitives)       │
│  - Button, Card, Dialog, Input...  │
└─────────────────────────────────────┘

     ┌────────────────────┐
     │   Custom Hooks     │
     │  - useAuth()       │
     │  - useMaterials()  │
     │  - useFlashcards() │
     └────────────────────┘
```

#### Padrões de Design Implementados

1. **Container/Presenter Pattern**: Separação de lógica e apresentação
2. **Custom Hooks Pattern**: Encapsulamento de lógica reutilizável
3. **Context API**: Estado global (Auth, Theme)
4. **Route Guards**: Proteção de rotas baseada em autenticação/autorização
5. **React Query Pattern**: Cache e sincronização de estado servidor
6. **Code Splitting**: Lazy loading de rotas

---

## 📥 Instalação

### Pré-requisitos

- **Node.js** >= 18
- **npm** ou **yarn**
- **Docker** e **Docker Compose** (para o banco de dados)
- **Git**

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/GuiVianadev/tcc.git
cd tcc
```

2. **Instale as dependências**

```bash
# Backend
npm run install:backend

# Frontend
npm run install:frontend
```

3. **Configure o banco de dados**

```bash
# Inicie o PostgreSQL via Docker
docker-compose up -d

# Execute as migrações
cd backend-tcc
npm run db:migrate
```

4. **Configure as variáveis de ambiente**

**Backend** (`backend-tcc/.env`):

```env
NODE_ENV=dev
PORT=3333
DATABASE_URL=postgresql://docker:docker@localhost:5433/backend-tcc
JWT_SECRET=seu-secret-super-seguro-aqui
GOOGLE_GENERATIVE_AI_API_KEY=sua-chave-gemini-aqui

# Admin User (para seed)
ADMIN_EMAIL=admin@cognitio.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Administrador
```

**Frontend** (`web/.env.local`):

```env
VITE_API_URL=http://localhost:3333
VITE_ENABLE_API_DELAY=false
```

5. **Seed do usuário admin (opcional)**

```bash
cd backend-tcc
npm run db:seed:admin
```

6. **Inicie os servidores de desenvolvimento**

Em terminais separados:

```bash
# Backend (porta 3333)
npm run dev:backend

# Frontend (porta 5173)
npm run dev:frontend
```

7. **Acesse a aplicação**

Abra seu navegador em: http://localhost:5173

---

## 💻 Uso

### Criando sua conta

1. Acesse a página inicial
2. Clique em "Registrar"
3. Preencha seus dados
4. Complete o onboarding definindo sua área de interesse e metas

### Adicionando materiais

**Opção 1: Upload de arquivo**
1. Vá para "Materiais"
2. Clique em "Novo Material"
3. Faça upload do arquivo (PDF, DOCX, TXT, PNG, JPG)
4. Aguarde a IA processar e gerar o conteúdo

**Opção 2: Texto/Tópico**
1. Vá para "Materiais"
2. Clique em "Novo Material"
3. Digite o título e o conteúdo ou tópico
4. Deixe a IA gerar o material completo

### Estudando com flashcards

1. Acesse "Flashcards"
2. Visualize os cartões que estão prontos para revisão
3. Responda mentalmente à pergunta
4. Revele a resposta
5. Avalie a dificuldade: "novamente", "difícil", "bom" ou "fácil"
6. O algoritmo SM-2 ajustará automaticamente o próximo agendamento

### Fazendo quizzes

1. Acesse "Quiz"
2. Selecione um material
3. Responda às questões de múltipla escolha
4. Veja seu desempenho ao final
5. Acompanhe seu progresso no dashboard

### Acompanhando seu progresso

1. Acesse o "Dashboard"
2. Visualize suas estatísticas:
   - Flashcards estudados hoje/total
   - Quizzes completados hoje/total
   - Taxa de acerto
   - Streak atual
   - Gráficos de desempenho semanal
   - Calendário de atividades

### Área administrativa (apenas admins)

1. Acesse "Usuários" (menu admin)
2. Visualize todos os usuários cadastrados
3. Desative/reative contas conforme necessário

---

## 📁 Estrutura do Projeto

```
tcc-p/
├── backend-tcc/                 # Backend Fastify
│   ├── drizzle/                 # Migrações do banco
│   │   ├── 0000_*.sql
│   │   └── ...
│   ├── src/
│   │   ├── db/                  # Configuração do banco
│   │   │   ├── schema.ts        # Schema Drizzle (9 tabelas)
│   │   │   ├── connection.ts
│   │   │   └── seed.ts
│   │   ├── env/                 # Validação de variáveis
│   │   │   └── index.ts
│   │   ├── http/
│   │   │   ├── controllers/     # Controllers por feature
│   │   │   │   ├── users/
│   │   │   │   ├── materials/
│   │   │   │   ├── flashcards/
│   │   │   │   ├── quizzes/
│   │   │   │   ├── summaries/
│   │   │   │   └── study-goals/
│   │   │   └── server.ts        # Configuração Fastify
│   │   ├── lib/                 # Bibliotecas auxiliares
│   │   │   ├── srs-algorithm.ts # Algoritmo SM-2
│   │   │   └── ...
│   │   ├── middlewares/         # Middlewares de autenticação
│   │   │   ├── verify-jwt.ts
│   │   │   └── verify-user-role.ts
│   │   ├── repositories/        # Camada de dados
│   │   │   ├── drizzle/         # Implementações
│   │   │   └── interfaces/      # Interfaces abstratas
│   │   ├── services/            # Lógica de negócio
│   │   │   ├── errors/          # Erros personalizados
│   │   │   └── factories/       # Service factories
│   │   ├── utils/               # Utilitários
│   │   │   ├── ai.ts            # Integração IA
│   │   │   └── file-processing.ts
│   │   └── server.ts            # Entry point
│   ├── .env.example
│   ├── docker-compose.yml       # PostgreSQL container
│   ├── drizzle.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── tsup.config.ts
│
├── web/                         # Frontend React
│   ├── public/                  # Assets estáticos
│   ├── src/
│   │   ├── api/                 # Chamadas API
│   │   │   ├── auth.ts
│   │   │   ├── materials.ts
│   │   │   ├── flashcards.ts
│   │   │   └── ...
│   │   ├── components/          # Componentes React
│   │   │   ├── ui/              # Componentes primitivos
│   │   │   └── ...              # Componentes de feature
│   │   ├── contexts/            # React Contexts
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/               # Custom hooks
│   │   │   ├── use-materials.ts
│   │   │   ├── use-flashcards.ts
│   │   │   └── ...
│   │   ├── layouts/             # Layouts compartilhados
│   │   │   ├── app-layout.tsx
│   │   │   └── auth-layout.tsx
│   │   ├── lib/                 # Bibliotecas
│   │   │   ├── axios.ts
│   │   │   ├── token-manager.ts
│   │   │   └── utils.ts
│   │   ├── pages/               # Páginas (rotas)
│   │   │   ├── dashboard.tsx
│   │   │   ├── materials.tsx
│   │   │   ├── flashcards.tsx
│   │   │   ├── quiz.tsx
│   │   │   └── ...
│   │   ├── routes/              # Configuração de rotas
│   │   │   ├── index.tsx
│   │   │   └── guards/          # Route guards
│   │   ├── env.ts               # Validação de env vars
│   │   ├── main.tsx             # Entry point
│   │   └── App.tsx
│   ├── .env.local
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── render.yaml              # Config deploy Render
│
├── package.json                 # Monorepo scripts
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3333
```

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/users/register` | Criar nova conta | Público |
| POST | `/users/login` | Login | Público |
| POST | `/users/logout` | Logout | Público |
| PATCH | `/users/token/refresh` | Renovar token | Público |

### Usuário

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/me` | Perfil do usuário | JWT |
| GET | `/users/me/statistics` | Estatísticas do usuário | JWT |
| GET | `/users/ranking/streak` | Ranking de usuários | JWT |
| PATCH | `/user/update` | Atualizar perfil | JWT |
| DELETE | `/users/delete` | Desativar conta | JWT |
| GET | `/users` | Listar usuários (paginado) | Admin |
| PATCH | `/users/reactivate` | Reativar usuário | Admin |

### Materiais

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/materials` | Criar material | JWT |
| GET | `/materials` | Listar materiais (paginado) | JWT |
| GET | `/materials/recents` | Materiais recentes | JWT |
| DELETE | `/materials/:id` | Deletar material | JWT |

### Flashcards

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/flashcards` | Listar todos | JWT |
| GET | `/flashcards/due` | Flashcards para revisar | JWT |
| GET | `/flashcards/:flashcardId/history` | Histórico de revisões | JWT |
| POST | `/flashcards/:flashcardId/review` | Revisar flashcard | JWT |
| GET | `/materials/:materialId/flashcards` | Flashcards por material | JWT |

### Quiz

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/quizzes` | Listar todos | JWT |
| GET | `/materials/:materialId/quizzes` | Quiz por material | JWT |
| POST | `/quizzes/:quizId/start` | Iniciar sessão de quiz | JWT |
| POST | `/quizzes/:quizId/answer` | Responder questão | JWT |
| GET | `/quizzes/:materialId/progress` | Progresso do quiz | JWT |
| POST | `/quizzes/:materialId/reset` | Resetar progresso | JWT |

### Resumos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/summaries` | Listar resumos | JWT |
| GET | `/summaries/:materialId` | Resumo por material | JWT |

### Metas de Estudo

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/study-goals` | Obter metas | JWT |
| POST | `/study-goals` | Criar/atualizar metas | JWT |
| PATCH | `/study-goals` | Atualizar metas | JWT |

### Exemplos de Request/Response

**POST /materials** (Upload de arquivo)

```bash
curl -X POST http://localhost:3333/materials \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "title=Introdução ao React" \
  -F "file=@arquivo.pdf"
```

**POST /materials** (Texto/Tópico)

```json
// Request
{
  "title": "JavaScript Async/Await",
  "content": "Explique async/await em JavaScript com exemplos práticos"
}

// Response
{
  "material": {
    "id": "uuid",
    "title": "JavaScript Async/Await",
    "content": "...",
    "user_id": "uuid",
    "created_at": "2025-11-19T10:00:00Z",
    "updated_at": "2025-11-19T10:00:00Z"
  }
}
```

**POST /flashcards/:flashcardId/review**

```json
// Request
{
  "difficulty": "good"
}

// Response
{
  "flashcard": {
    "id": "uuid",
    "ease_factor": 2.6,
    "interval_days": 6,
    "repetitions": 3,
    "next_review": "2025-11-25T10:00:00Z"
  }
}
```

---

## 🗄️ Banco de Dados

### Schema Completo

```sql
-- users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL, -- 'student' | 'admin'
  password_hashed TEXT NOT NULL,
  is_first_access BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP -- soft delete
);

-- materials
CREATE TABLE materials (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX materials_user_idx ON materials(user_id);

-- summaries
CREATE TABLE summaries (
  id UUID PRIMARY KEY,
  content TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  material_id UUID UNIQUE REFERENCES materials(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX summaries_material_idx ON summaries(material_id);

-- flashcards
CREATE TABLE flashcards (
  id UUID PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  ease_factor REAL DEFAULT 2.5,
  interval_days INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  next_review TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX flashcards_material_idx ON flashcards(material_id);
CREATE INDEX flashcards_next_review_idx ON flashcards(next_review);

-- quizzes
CREATE TABLE quizzes (
  id UUID PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- [{ id: "a", text: "..." }, ...]
  correct_answer TEXT NOT NULL, -- "a" | "b" | "c" | "d"
  studied BOOLEAN DEFAULT false,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX quizzes_material_idx ON quizzes(material_id);
CREATE INDEX quizzes_studied_idx ON quizzes(studied);

-- study_sessions
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  flashcards_studied INTEGER DEFAULT 0,
  flashcards_correct INTEGER DEFAULT 0,
  quizzes_completed INTEGER DEFAULT 0,
  quizzes_correct INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);
CREATE INDEX sessions_user_date_idx ON study_sessions(user_id, date);

-- study_goals
CREATE TABLE study_goals (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  area_of_interest TEXT,
  daily_flashcards_goal INTEGER DEFAULT 20,
  daily_quizzes_goal INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- quiz_attempts
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  attempted_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX quiz_attempts_quiz_idx ON quiz_attempts(quiz_id);
CREATE INDEX quiz_attempts_user_idx ON quiz_attempts(user_id);

-- flashcard_reviews
CREATE TABLE flashcard_reviews (
  id UUID PRIMARY KEY,
  flashcard_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  difficulty TEXT NOT NULL, -- "again" | "hard" | "good" | "easy"
  ease_factor_after REAL NOT NULL,
  interval_days_after INTEGER NOT NULL,
  reviewed_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX flashcard_reviews_flashcard_idx ON flashcard_reviews(flashcard_id);
CREATE INDEX flashcard_reviews_user_idx ON flashcard_reviews(user_id);
```

### Relacionamentos

```
users (1) ──< (N) materials
users (1) ──< (N) flashcards
users (1) ──< (N) quizzes
users (1) ──< (N) study_sessions
users (1) ──< (1) study_goals
users (1) ──< (N) quiz_attempts
users (1) ──< (N) flashcard_reviews

materials (1) ──< (1) summaries
materials (1) ──< (N) flashcards
materials (1) ──< (N) quizzes

quizzes (1) ──< (N) quiz_attempts
flashcards (1) ──< (N) flashcard_reviews
```

---

## 🔐 Autenticação e Segurança

### Fluxo de Autenticação

```
1. Login/Register
   ↓
2. Backend gera:
   - Access Token (JWT, 10 min) → retornado no body
   - Refresh Token (JWT, longo prazo) → httpOnly cookie
   ↓
3. Frontend:
   - Armazena access token na MEMÓRIA (não localStorage)
   - Cookie gerenciado automaticamente pelo navegador
   ↓
4. Requisições subsequentes:
   - Access token enviado no header: Authorization: Bearer <token>
   ↓
5. Quando access token expira:
   - Interceptor Axios detecta 401
   - Chama /users/token/refresh (cookie enviado automaticamente)
   - Backend valida refresh token
   - Retorna novo access token
   - Requisição original é repetida
   ↓
6. Logout:
   - Cookie é invalidado
   - Token é removido da memória
```

### Medidas de Segurança Implementadas

1. **Proteção contra XSS**
   - Tokens não armazenados em localStorage
   - httpOnly cookies (inacessíveis via JavaScript)

2. **Proteção contra CSRF**
   - SameSite cookies
   - CORS configurado com allowed origins

3. **Senha Segura**
   - Hash bcrypt com salt
   - Nunca exposta em APIs

4. **JWT**
   - Assinatura com secret
   - Expiração configurável
   - Validação em middleware

5. **Soft Delete**
   - Dados não são apagados permanentemente
   - Campo deleted_at para desativação

6. **Validação de Entrada**
   - Zod schemas em todas as rotas
   - Sanitização de dados

7. **Rate Limiting**
   - Limite de upload: 10MB
   - Timeout configurável

8. **RBAC (Role-Based Access Control)**
   - Roles: student, admin
   - Middleware verifyUserRole
   - Rotas protegidas por role

---

## 🧪 Testes

### Backend

**Framework**: Vitest + Supertest

**Comandos**:

```bash
npm test              # Modo watch
npm run test:ui       # Interface visual
npm run test:run      # Execução única
npm run test:coverage # Com cobertura
```

**Exemplos de testes**:

- Algoritmo SM-2: `src/lib/srs-algorithm.spec.ts`
- Rotas de flashcards: `src/http/controllers/flashcards/routes.spec.ts`
- Estatísticas de usuário: `src/http/controllers/users/get-user-statistics.spec.ts`

**Cobertura**:
- Providers: v8
- Formato: text, json, html
- Exclusões: db/, env/, node_modules/

### Frontend

Atualmente sem testes automatizados. Recomenda-se:
- Vitest para testes unitários
- React Testing Library para testes de componentes
- Playwright/Cypress para E2E

---

## 🚢 Deploy

### Backend

**Opções recomendadas**:
- **Railway**: Deploy automático via Git
- **Render**: Configuração via render.yaml
- **Vercel**: Suporta Node.js
- **AWS/Azure/GCP**: Mais controle e escalabilidade

**Passos gerais**:

1. Configure as variáveis de ambiente na plataforma
2. Configure o DATABASE_URL do PostgreSQL de produção
3. Execute as migrações: `npm run db:migrate`
4. Seed do admin: `npm run db:seed:prod`
5. Build: `npm run build`
6. Start: `npm start`

**Docker** (opcional):

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3333
CMD ["npm", "start"]
```

### Frontend

**Configurado para Render.com** via `render.yaml`:

```yaml
services:
  - type: web
    name: cognitio-ai-frontend
    env: static
    buildCommand: cd web && npm install && npm run build
    staticPublishPath: ./web/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

**Outras opções**:
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **Cloudflare Pages**: Deploy automático via Git
- **GitHub Pages**: Com configuração de SPA

**Variáveis de ambiente** (ajustar VITE_API_URL para URL de produção):

```env
VITE_API_URL=https://api-cognitio.exemplo.com
```

---

## 🔧 Variáveis de Ambiente

### Backend (.env)

```env
# Ambiente
NODE_ENV=dev                    # dev | test | production

# Servidor
PORT=3333

# Banco de Dados
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=seu-secret-super-seguro-e-longo-aqui

# IA (opcional, mas recomendado)
GOOGLE_GENERATIVE_AI_API_KEY=sua-chave-gemini

# CORS (apenas produção)
FRONTEND_URL=https://app.exemplo.com

# Admin Seed
ADMIN_EMAIL=admin@exemplo.com
ADMIN_PASSWORD=senha-segura
ADMIN_NAME=Administrador
```

### Frontend (.env.local)

```env
# API Backend
VITE_API_URL=http://localhost:3333

# Delay simulado (dev only)
VITE_ENABLE_API_DELAY=false
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos abaixo:

1. **Fork** o projeto
2. **Clone** seu fork:
   ```bash
   git clone https://github.com/seu-usuario/tcc.git
   ```
3. Crie uma **branch** para sua feature:
   ```bash
   git checkout -b feature/minha-feature
   ```
4. **Commit** suas mudanças:
   ```bash
   git commit -m "feat: adiciona minha feature"
   ```
5. **Push** para sua branch:
   ```bash
   git push origin feature/minha-feature
   ```
6. Abra um **Pull Request**

### Padrões de Commit

Seguimos o [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação de código
- `refactor`: Refatoração sem mudança de comportamento
- `test`: Adição/modificação de testes
- `chore`: Tarefas de manutenção

### Code Style

O projeto usa **Biome** para linting e formatação:

```bash
# Backend
cd backend-tcc
npx biome check src/

# Frontend
cd web
npx biome check src/
```

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/GuiVianadev">
        <img src="https://github.com/GuiVianadev.png" width="100px;" alt="Guilherme Viana"/>
        <br />
        <sub><b>Guilherme Viana</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/fredalisson">
        <img src="https://github.com/fredalisson.png" width="100px;" alt="Fred Alisson"/>
        <br />
        <sub><b>Fred Alisson</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 🙏 Agradecimentos

- [Fastify](https://fastify.io/) - Framework web de alta performance
- [React](https://react.dev/) - Biblioteca para interfaces
- [Drizzle ORM](https://orm.drizzle.team/) - ORM moderno
- [Vercel AI SDK](https://sdk.vercel.ai/) - Integração com IA
- [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- Todos os contribuidores e a comunidade open source

---

## 📊 Status do Projeto

✅ **Versão 1.0.0** - Projeto completo e funcional

### Roadmap Futuro

- [ ] Testes automatizados para frontend
- [ ] PWA com suporte offline
- [ ] Notificações push para revisões
- [ ] Modo colaborativo (grupos de estudo)
- [ ] Integração com mais modelos de IA
- [ ] Suporte para vídeos e áudios
- [ ] Aplicativo mobile (React Native)
- [ ] Exportação de estatísticas (PDF/CSV)
- [ ] Sistema de badges e conquistas
- [ ] Integração com calendários externos

---

## 📞 Suporte

Se você encontrou um bug ou tem uma sugestão:

- Abra uma [issue](https://github.com/GuiVianadev/tcc/issues)
- Entre em contato via email (verifique os perfis dos autores)

---

<div align="center">

**Desenvolvido com ❤️ por Guilherme Viana e Fred Alisson**

[⬆ Voltar ao topo](#cognitio-ai---plataforma-de-estudos-com-ia)

</div>