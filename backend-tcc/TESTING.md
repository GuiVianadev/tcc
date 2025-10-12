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

### ✅ Flashcards Routes
- `GET /flashcards` - Listagem com paginação
- `GET /flashcards/due` - Flashcards devidos para revisão
- `GET /materials/:materialId/flashcards` - Flashcards de um material
- `POST /flashcards/:flashcardId/review` - Revisar flashcard (SRS)
- Validações de dificuldade ("again", "hard", "good", "easy")
- Validações de autenticação e autorização

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

## 📝 Próximos Passos (Melhorias Futuras)

- [ ] Criar fixtures para testes E2E mais completos
- [ ] Implementar testes de integração com banco de dados de teste
- [ ] Adicionar testes de carga/performance
- [ ] Aumentar cobertura de testes unitários nos services
- [ ] Implementar CI/CD com testes automáticos
