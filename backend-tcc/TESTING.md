# 🧪 Testing Guide

Este projeto utiliza **Vitest** para testes unitários e E2E, e **Supertest** para testar as rotas HTTP.

## 📋 Pré-requisitos

- Node.js instalado
- Dependências instaladas (`npm install`)
- Banco de dados PostgreSQL configurado e rodando
- Arquivo `.env` configurado

## 🚀 Como Rodar os Testes

### Rodar todos os testes
```bash
npm test
```

### Rodar testes em modo watch (desenvolvimento)
```bash
npm test
```

### Rodar testes uma única vez
```bash
npm run test:run
```

### Rodar testes com cobertura
```bash
npm run test:coverage
```

### Rodar testes com UI interativa
```bash
npm run test:ui
```

## 📁 Estrutura dos Testes

### Testes Unitários
Localizados junto aos arquivos de código, com extensão `.spec.ts` ou `.test.ts`.

**Exemplo:**
- `src/lib/srs-algorithm.spec.ts` - Testes do algoritmo SM-2

### Testes E2E (End-to-End)
Testes das rotas HTTP, localizados em:
- `src/http/controllers/summaries/routes.spec.ts`
- `src/http/controllers/quizzes/routes.spec.ts`
- `src/http/controllers/flashcards/routes.spec.ts`
- `src/http/controllers/flashcards/get-flashcard-history.spec.ts`
- `src/http/controllers/users/get-user-statistics.spec.ts`

## 🧪 O que foi testado

### ✅ Summaries Routes
- `GET /summaries` - Listagem com paginação
- `GET /materials/:materialId/summary` - Buscar summary específico
- Validações de autenticação e autorização
- Validações de entrada (UUIDs, paginação)

### ✅ Quizzes Routes
- `GET /quizzes` - Listagem com paginação
- `GET /materials/:materialId/quizzes` - Buscar quizzes de um material
- `POST /quizzes/:quizId/answer` - Responder quiz
- Validações de dificuldade ("a", "b", "c", "d")
- Validações de autenticação e autorização
- **Salva tentativas em quiz_attempts** ✨
- **Atualiza study_sessions automaticamente** ✨

### ✅ Flashcards Routes
- `GET /flashcards` - Listagem com paginação
- `GET /flashcards/due` - Flashcards devidos para revisão
- `GET /materials/:materialId/flashcards` - Flashcards de um material
- `POST /flashcards/:flashcardId/review` - Revisar flashcard (SRS)
- `GET /flashcards/:flashcardId/history` - Histórico de revisões ✨
- Validações de dificuldade ("again", "hard", "good", "easy")
- Validações de autenticação e autorização
- **Salva histórico em flashcard_reviews** ✨
- **Atualiza study_sessions automaticamente** ✨

### ✅ User Statistics (Analytics) ✨
- `GET /users/me/statistics` - Estatísticas do usuário
- Taxa de acerto em quizzes
- Distribuição de dificuldade em flashcards
- Total de tentativas e revisões

### ✅ SM-2 Algorithm (Unit Tests)
- Primeira revisão (interval = 1 dia)
- Segunda revisão (interval = 6 dias)
- Revisões subsequentes (interval = anterior × ease_factor)
- Resposta "again" (reset)
- Resposta "hard" (diminui ease_factor)
- Resposta "easy" (bônus de 30%)
- Limites do ease_factor (mínimo 1.3)
- Cálculo da próxima data de revisão

## 📊 Cobertura de Testes

Para ver a cobertura de testes, rode:
```bash
npm run test:coverage
```

O relatório será gerado em `coverage/index.html`.

**Status Atual:** 48 testes passando ✅
- 9 testes unitários (SM-2 Algorithm)
- 39 testes E2E (Rotas HTTP)

## 🔍 Boas Práticas

1. **Isolamento**: Cada teste deve ser independente
2. **Autenticação**: Use o helper `createAndAuthenticateUser()` para testes autenticados
3. **Cleanup**: Os testes E2E inicializam e fecham a aplicação automaticamente
4. **Nomes descritivos**: Use `describe()` e `it()` com descrições claras

## 🛠️ Utilities

### Helper de Autenticação
```typescript
import { createAndAuthenticateUser } from "../../../utils/test/create-and-authenticate-user.ts";

const { token } = await createAndAuthenticateUser(app);
```

Este helper:
- Cria um usuário de teste único (com email único usando timestamp)
- Usa senha com 8 caracteres (mínimo exigido pela validação)
- Faz login automaticamente
- Retorna o token JWT para uso nos testes

## ⚠️ Notas Importantes

- Os testes E2E usam o **banco de dados real** configurado no `.env`
- Recomenda-se usar um banco de dados separado para testes
- Alguns testes verificam apenas validações (404, 400, 401) sem criar dados reais
- Para testes mais completos, seria necessário criar fixtures de materiais/quizzes/flashcards

## 📝 Melhorias Implementadas (FASE 5)

### ✨ Analytics - Quiz Attempts
- **Tabela `quiz_attempts`**: Armazena todas as tentativas de quiz
- **Campos**: quiz_id, user_id, selected_answer, is_correct, attempted_at
- **Integração**: AnswerQuizService salva automaticamente cada tentativa

### ✨ Analytics - Flashcard Reviews
- **Tabela `flashcard_reviews`**: Histórico completo de revisões
- **Campos**: flashcard_id, user_id, difficulty, ease_factor_after, interval_days_after, reviewed_at
- **Integração**: ReviewFlashcardService salva automaticamente cada revisão

### ✨ Study Sessions
- **Repository**: DrizzleStudySessionsRepository com upsert
- **Atualização automática**: Incrementa contadores ao responder quizzes/revisar flashcards
- **Campos atualizados**: flashcards_studied, flashcards_correct, quizzes_completed, quizzes_correct

### ✨ User Statistics
- **Endpoint**: `GET /users/me/statistics`
- **Quizzes**: total_attempts, correct_attempts, accuracy_rate
- **Flashcards**: total_reviews, difficulty_distribution (again/hard/good/easy)

### ✨ Flashcard History
- **Endpoint**: `GET /flashcards/:flashcardId/history`
- **Resposta**: Array de reviews com difficulty, ease_factor, interval_days, timestamp

## 🎯 Próximos Passos (Futuras Melhorias)

- [ ] Criar fixtures para testes E2E mais completos
- [ ] Implementar testes de integração com banco de dados de teste
- [ ] Adicionar testes de carga/performance
- [ ] Aumentar cobertura de testes unitários nos services
- [ ] Implementar CI/CD com testes automáticos
- [ ] Adicionar testes de estatísticas com dados reais
