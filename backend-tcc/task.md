# 📋 Tasks - Rotas Quizzes, Summaries e Flashcards

## 🎯 Visão Geral

Implementar rotas de **leitura apenas** (GET) para:
- **Summaries** - Visualizar resumo de um material
- **Quizzes** - Listar e responder quizzes
- **Flashcards** - Sistema de Repetição Espaçada (SRS - SM-2)

**Regras:**
- ❌ Sem PUT/DELETE (só deleta via material)
- ✅ Identificação via `material_id`
- ✅ Validação de permissão (user_id)

---

## 📚 Estrutura das Rotas
GET    /materials/:materialId/summary           # Ver resumo
GET    /materials/:materialId/quizzes            # Listar quizzes
POST   /quizzes/:quizId/answer                   # Responder quiz
GET    /flashcards/due                           # Cards para revisar hoje
POST   /flashcards/:flashcardId/review           # Revisar card (SRS)
GET    /materials/:materialId/flashcards         # Listar cards de um material

---

## ✅ Checklist de Implementação

### 📊 FASE 1: Summaries

#### Task 1.1: Repository - Summaries
```typescript
// Criar: src/repositories/summaries-repository.ts

 Importar tipos do Drizzle
 Criar type Summary = InferSelectModel<typeof summaries>
 Criar interface SummaryRepository:

findByMaterialId(materialId: string) → Promise<Summary | null>



typescript// Criar: src/repositories/drizzle/drizzle-summaries-repository.ts

 Implementar DrizzleSummariesRepository
 Método findByMaterialId():

Select where material_id = materialId
Retornar summary ou null



Task 1.2: Service - Get Summary
typescript// Criar: src/services/get-summary-service.ts

 Importar repositories e errors
 Criar interface GetSummaryRequest:

userId: string
materialId: string


 Criar classe GetSummaryService
 Construtor: receber MaterialRepository e SummaryRepository
 Método execute():

Buscar material por ID
Se não existe → throw NotFoundError
Se material.user_id !== userId → throw UnauthorizedError
Buscar summary por material_id
Se não existe → throw NotFoundError("Resumo não encontrado")
Retornar summary



Task 1.3: Factory - Get Summary
typescript// Criar: src/services/factories/make-get-summary.ts

 Instanciar DrizzleMaterialsRepository
 Instanciar DrizzleSummariesRepository
 Instanciar GetSummaryService
 Retornar service

Task 1.4: Controller - Get Summary
typescript// Criar: src/http/controllers/summaries/get-summary.controller.ts

 Importar Fastify types, zod, factory
 Criar schema de params: materialId (uuid)
 Função getSummary(request, reply):

Validar params
Chamar service com userId (request.user.sub) e materialId
Retornar 200 + summary
Catch NotFoundError → 404
Catch UnauthorizedError → 403



Task 1.5: Route - Summaries
typescript// Criar: src/http/routes/summaries.routes.ts

 Importar FastifyInstance, verifyJWT, controller
 Função summariesRoutes(app)
 Hook: verifyJWT
 Rota: GET /materials/:materialId/summary → getSummary
 Registrar no server.ts


🎲 FASE 2: Quizzes
Task 2.1: Repository - Quizzes
typescript// Criar: src/repositories/quizzes-repository.ts

 Criar type Quiz = InferSelectModel<typeof quizzes>
 Criar interface QuizRepository:

findByMaterialId(materialId: string) → Promise<Quiz[]>
findById(id: string) → Promise<Quiz | null>



typescript// Criar: src/repositories/drizzle/drizzle-quizzes-repository.ts

 Implementar DrizzleQuizzesRepository
 Método findByMaterialId():

Select where material_id = materialId
OrderBy created_at
Retornar array


 Método findById():

Select where id
Retornar quiz ou null



Task 2.2: Service - Get Quizzes
typescript// Criar: src/services/get-quizzes-service.ts

 Interface GetQuizzesRequest: userId, materialId
 Classe GetQuizzesService
 Construtor: MaterialRepository, QuizRepository
 Método execute():

Buscar material
Validar existência e permissão
Buscar quizzes por material_id
Retornar array de quizzes



Task 2.3: Service - Answer Quiz
typescript// Criar: src/services/answer-quiz-service.ts

 Interface AnswerQuizRequest:

userId: string
quizId: string
selectedAnswer: "a" | "b" | "c" | "d"


 Interface AnswerQuizResponse:

isCorrect: boolean
correctAnswer: string
explanation?: string (opcional, futuro)


 Classe AnswerQuizService
 Construtor: MaterialRepository, QuizRepository
 Método execute():

Buscar quiz por ID
Se não existe → throw NotFoundError
Buscar material do quiz
Validar se material.user_id === userId
Comparar selectedAnswer com quiz.correct_answer
TODO FUTURO: Salvar tentativa em quiz_attempts (opcional)
Retornar { isCorrect, correctAnswer }



Task 2.4: Factories - Quizzes
typescript// Criar: src/services/factories/make-get-quizzes.ts
// Criar: src/services/factories/make-answer-quiz.ts

 make-get-quizzes: instanciar repos + service
 make-answer-quiz: instanciar repos + service

Task 2.5: Controllers - Quizzes
typescript// Criar: src/http/controllers/quizzes/get-quizzes.controller.ts

 Schema params: materialId (uuid)
 Função getQuizzes():

Validar params
Chamar service
Retornar 200 + array quizzes



typescript// Criar: src/http/controllers/quizzes/answer-quiz.controller.ts

 Schema params: quizId (uuid)
 Schema body: selectedAnswer (enum "a"|"b"|"c"|"d")
 Função answerQuiz():

Validar params + body
Chamar service
Retornar 200 + { isCorrect, correctAnswer }



Task 2.6: Routes - Quizzes
typescript// Criar: src/http/routes/quizzes.routes.ts

 Hook: verifyJWT
 GET /materials/:materialId/quizzes → getQuizzes
 POST /quizzes/:quizId/answer → answerQuiz
 Registrar no server.ts


🎴 FASE 3: Flashcards (SRS - Spaced Repetition System)
Task 3.1: Repository - Flashcards
typescript// Criar: src/repositories/flashcards-repository.ts

 Criar type Flashcard = InferSelectModel<typeof flashcards>
 Criar interface FlashcardRepository:

findByMaterialId(materialId: string) → Promise<Flashcard[]>
findById(id: string) → Promise<Flashcard | null>
findDueCards(userId: string) → Promise<Flashcard[]>
updateReview(id: string, data: UpdateReviewData) → Promise<Flashcard>



typescript// Criar: src/repositories/drizzle/drizzle-flashcards-repository.ts

 Implementar DrizzleFlashcardsRepository
 Método findByMaterialId():

Select where material_id
OrderBy created_at


 Método findById():

Select where id


 Método findDueCards():

Select where user_id = userId
AND (next_review <= NOW() OR next_review IS NULL)
OrderBy next_review ASC (mais atrasados primeiro)
Limit 50 (não trazer todos de uma vez)


 Método updateReview():

Update ease_factor, interval_days, repetitions, next_review, last_reviewed
Where id
Returning



Task 3.2: Lib - Algoritmo SM-2
typescript// Criar: src/lib/srs-algorithm.ts (Spaced Repetition System)

 Criar enum ou type Difficulty:

"again" = 0
"hard" = 2
"good" = 3
"easy" = 4


 Criar interface SM2Input:

ease_factor: number
interval_days: number
repetitions: number
difficulty: Difficulty


 Criar interface SM2Output:

ease_factor: number
interval_days: number
repetitions: number
next_review: Date


 Função calculateSM2(input: SM2Input): SM2Output:

Se difficulty < 3 (again/hard):

repetitions = 0
interval_days = 1
ease_factor -= 0.15 (só se hard)
ease_factor = Math.max(1.3, ease_factor)


Se difficulty >= 3 (good/easy):

ease_factor += (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
ease_factor = Math.max(1.3, ease_factor)
repetitions += 1
Se repetitions === 1: interval_days = 1
Se repetitions === 2: interval_days = 6
Se repetitions > 2: interval_days = Math.round(interval_days * ease_factor)


Se difficulty === 4 (easy):

interval_days *= 1.3 (bônus)


Calcular next_review = new Date() + interval_days
Retornar SM2Output



Referência: https://en.wikipedia.org/wiki/SuperMemo#Algorithm_SM-2
Task 3.3: Service - Get Due Flashcards
typescript// Criar: src/services/get-due-flashcards-service.ts

 Interface GetDueFlashcardsRequest: userId
 Interface GetDueFlashcardsResponse:

flashcards: Flashcard[]
totalDue: number


 Classe GetDueFlashcardsService
 Construtor: FlashcardRepository
 Método execute():

Buscar cards devidos (findDueCards)
Retornar { flashcards, totalDue: flashcards.length }



Task 3.4: Service - Review Flashcard
typescript// Criar: src/services/review-flashcard-service.ts

 Importar calculateSM2 do lib/srs-algorithm
 Interface ReviewFlashcardRequest:

userId: string
flashcardId: string
difficulty: "again" | "hard" | "good" | "easy"


 Interface ReviewFlashcardResponse:

flashcard: Flashcard
nextReview: Date


 Classe ReviewFlashcardService
 Construtor: FlashcardRepository, MaterialRepository
 Método execute():

Buscar flashcard por ID
Se não existe → throw NotFoundError
Buscar material do flashcard
Validar se material.user_id === userId
Chamar calculateSM2 com dados atuais do card
Atualizar card no banco com novos valores
TODO FUTURO: Atualizar study_session (incrementar flashcards_studied)
Retornar { flashcard, nextReview }



Task 3.5: Service - Get Material Flashcards
typescript// Criar: src/services/get-material-flashcards-service.ts

 Interface GetMaterialFlashcardsRequest: userId, materialId
 Classe GetMaterialFlashcardsService
 Construtor: MaterialRepository, FlashcardRepository
 Método execute():

Buscar material + validar permissão
Buscar flashcards por material_id
Retornar array



Task 3.6: Factories - Flashcards
typescript// Criar: src/services/factories/make-get-due-flashcards.ts
// Criar: src/services/factories/make-review-flashcard.ts
// Criar: src/services/factories/make-get-material-flashcards.ts

 Instanciar repositories
 Instanciar services
 Retornar services

Task 3.7: Controllers - Flashcards
typescript// Criar: src/http/controllers/flashcards/get-due-flashcards.controller.ts

 Função getDueFlashcards():

Chamar service com userId
Retornar 200 + { flashcards, totalDue }



typescript// Criar: src/http/controllers/flashcards/review-flashcard.controller.ts

 Schema params: flashcardId (uuid)
 Schema body: difficulty (enum)
 Função reviewFlashcard():

Validar params + body
Chamar service
Retornar 200 + { flashcard, nextReview }



typescript// Criar: src/http/controllers/flashcards/get-material-flashcards.controller.ts

 Schema params: materialId (uuid)
 Função getMaterialFlashcards():

Validar params
Chamar service
Retornar 200 + flashcards[]



Task 3.8: Routes - Flashcards
typescript// Criar: src/http/routes/flashcards.routes.ts

 Hook: verifyJWT
 GET /flashcards/due → getDueFlashcards
 POST /flashcards/:flashcardId/review → reviewFlashcard
 GET /materials/:materialId/flashcards → getMaterialFlashcards
 Registrar no server.ts


🧪 FASE 4: Testes
Task 4.1: Testar Summaries
Postman/Insomnia:

 Criar material via POST /materials
 GET /materials/{materialId}/summary
 Verificar resposta 200 + summary
 Testar com materialId de outro usuário → 403
 Testar com materialId inexistente → 404

Task 4.2: Testar Quizzes
Postman/Insomnia:

 GET /materials/{materialId}/quizzes
 Verificar array de quizzes
 Pegar ID de um quiz
 POST /quizzes/{quizId}/answer

Body: { "selectedAnswer": "a" }


 Verificar { isCorrect: true/false, correctAnswer: "x" }
 Testar resposta correta
 Testar resposta errada
 Testar quiz de outro usuário → 403

Task 4.3: Testar Flashcards - Básico
Postman/Insomnia:

 GET /materials/{materialId}/flashcards
 Verificar array de flashcards
 GET /flashcards/due
 Verificar { flashcards[], totalDue }
 Se totalDue = 0, aguardar ou criar material novo

Task 4.4: Testar Flashcards - SRS Completo
Postman/Insomnia:

 Pegar ID de um flashcard due
 POST /flashcards/{flashcardId}/review

Body: { "difficulty": "good" }


 Verificar resposta: { flashcard, nextReview }
 Verificar que next_review está no futuro
 Verificar que interval_days > 0
 Testar com "again" → next_review amanhã
 Testar com "easy" → next_review mais distante
 GET /flashcards/due novamente → card não deve aparecer

Task 4.5: Testar Algoritmo SM-2
typescript// Criar: test-sm2.ts (temporário)

 Importar calculateSM2
 Testar cenário 1 (card novo + "good"):

typescript  const result = calculateSM2({
    ease_factor: 2.5,
    interval_days: 0,
    repetitions: 0,
    difficulty: "good"
  });
  console.log(result); // interval_days = 1

 Testar cenário 2 (segunda revisão + "good"):

typescript  const result = calculateSM2({
    ease_factor: 2.5,
    interval_days: 1,
    repetitions: 1,
    difficulty: "good"
  });
  console.log(result); // interval_days = 6

 Testar cenário 3 (errou + "again"):

typescript  const result = calculateSM2({
    ease_factor: 2.5,
    interval_days: 6,
    repetitions: 2,
    difficulty: "again"
  });
  console.log(result); // interval_days = 1, repetitions = 0

 Verificar que ease_factor nunca fica < 1.3
 Deletar arquivo de teste


📊 FASE 5: Melhorias Futuras (Opcional)
Task 5.1: Tabela quiz_attempts (Analytics)
sql-- Migration futura
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id),
  user_id UUID REFERENCES users(id),
  selected_answer TEXT,
  is_correct BOOLEAN,
  attempted_at TIMESTAMP DEFAULT NOW()
);

 Criar migration
 Atualizar AnswerQuizService para salvar tentativa
 Criar rota GET /users/me/statistics (taxa de acerto)

Task 5.2: Tabela flashcard_reviews (Histórico)
sql-- Migration futura
CREATE TABLE flashcard_reviews (
  id UUID PRIMARY KEY,
  flashcard_id UUID REFERENCES flashcards(id),
  user_id UUID REFERENCES users(id),
  difficulty TEXT,
  ease_factor_after REAL,
  interval_days_after INTEGER,
  reviewed_at TIMESTAMP DEFAULT NOW()
);

 Criar migration
 Atualizar ReviewFlashcardService para salvar histórico
 Criar rota GET /flashcards/{id}/history

Task 5.3: Study Sessions
typescript// Atualizar study_sessions ao revisar flashcards/quizzes

 No ReviewFlashcardService: incrementar flashcards_studied
 No AnswerQuizService: incrementar quizzes_completed
 Usar INSERT ... ON CONFLICT DO UPDATE para upsert


📋 Ordem Recomendada de Execução

✅ FASE 1: Summaries (mais simples, warmup)
✅ FASE 2: Quizzes (intermediário)
✅ FASE 3: Flashcards + SRS (mais complexo)
✅ FASE 4: Testes (validação completa)
⏭️ FASE 5: Melhorias (quando tiver tempo)


🚨 Pontos Críticos
⚠️ Algoritmo SM-2

Testar MUITO bem antes de usar em produção
Valores iniciais: ease_factor = 2.5, interval_days = 0, repetitions = 0
Ease factor mínimo sempre 1.3
Documentar fórmulas usadas

⚠️ Validação de Permissão

SEMPRE validar se material.user_id === userId
NUNCA confiar apenas no flashcard.user_id (pode estar dessinc)
Buscar material primeiro, depois validar

⚠️ Next Review

Usar timezone UTC no banco
Comparar next_review <= NOW() para cards devidos
Cards com next_review = NULL são novos (nunca revisados)

⚠️ Performance

Limitar query de findDueCards (max 50 cards)
Criar índice: CREATE INDEX idx_flashcards_next_review ON flashcards(user_id, next_review)
Considerar paginação se usuário tiver 1000+ cards


📁 Estrutura Final
src/
├── lib/
│   ├── ai-service.ts           ✅ Já existe
│   └── srs-algorithm.ts        ⬜ Criar (SM-2)
├── repositories/
│   ├── summaries-repository.ts
│   ├── quizzes-repository.ts
│   ├── flashcards-repository.ts
│   └── drizzle/
│       ├── drizzle-summaries-repository.ts
│       ├── drizzle-quizzes-repository.ts
│       └── drizzle-flashcards-repository.ts
├── services/
│   ├── get-summary-service.ts
│   ├── get-quizzes-service.ts
│   ├── answer-quiz-service.ts
│   ├── get-due-flashcards-service.ts
│   ├── review-flashcard-service.ts
│   ├── get-material-flashcards-service.ts
│   └── factories/
│       ├── make-get-summary.ts
│       ├── make-get-quizzes.ts
│       ├── make-answer-quiz.ts
│       ├── make-get-due-flashcards.ts
│       ├── make-review-flashcard.ts
│       └── make-get-material-flashcards.ts
├── http/
│   ├── controllers/
│   │   ├── summaries/
│   │   │   └── get-summary.controller.ts
│   │   ├── quizzes/
│   │   │   ├── get-quizzes.controller.ts
│   │   │   └── answer-quiz.controller.ts
│   │   └── flashcards/
│   │       ├── get-due-flashcards.controller.ts
│   │       ├── review-flashcard.controller.ts
│   │       └── get-material-flashcards.controller.ts
│   └── routes/
│       ├── summaries.routes.ts
│       ├── quizzes.routes.ts
│       └── flashcards.routes.ts
└── server.ts (registrar rotas)

🎯 Você está aqui:
[✅] Materials + IA Service
[  ] Summaries (FASE 1)
[  ] Quizzes (FASE 2)
[  ] Flashcards + SRS (FASE 3)
[  ] Testes (FASE 4)
Boa implementação! 🚀

💡 Dicas

Implemente Summaries primeiro (mais simples)
Teste o algoritmo SM-2 isoladamente antes de integrar
Use Postman Collections para salvar testes
Cards com next_review = NULL devem aparecer em "due"
Difficulty "again" = errou, "easy" = muito fácil
Commits frequentes por fase


📚 Referências

SuperMemo Algorithm SM-2
Anki SRS Implementation
SM-2 em TypeScript (exemplo)