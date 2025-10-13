markdown# 📋 Tasks - Study Goals & Study Sessions

## 🎯 Visão Geral

Implementar sistema de metas e sessões de estudo:
- **Study Goals** - Configuração de metas diárias (onboarding)
- **Study Sessions** - Rastreamento automático de atividades
- **Dashboard** - Estatísticas para o frontend

**Fluxo:**
1º Login → Onboarding (Study Goals) → is_first_access = false
Estuda → Auto-incrementa Study Session
Frontend → GET /dashboard → Estatísticas

---

## 📊 Estrutura das Rotas
Study Goals
POST   /goals                    # Criar/Atualizar metas (onboarding)
GET    /goals                    # Ver minhas metas
PUT    /goals                    # Atualizar metas
Study Sessions (automático)
Não tem rota POST - incrementa automaticamente
Dashboard
GET    /dashboard                # Estatísticas completas
GET    /dashboard/today          # Progresso do dia
GET    /dashboard/streak         # Streak atual

---

## ✅ Checklist de Implementação

### 🎯 FASE 1: Study Goals (Onboarding)

#### Task 1.1: Repository - Study Goals
```typescript
// Criar: src/repositories/study-goals-repository.ts

 Importar tipos do Drizzle
 Criar type StudyGoal = InferSelectModel<typeof study_goals>
 Criar interface StudyGoalsRepository:

create(data) → Promise<StudyGoal>
findByUserId(userId: string) → Promise<StudyGoal | null>
update(userId: string, data: Partial<StudyGoal>) → Promise<StudyGoal>



typescript// Criar: src/repositories/drizzle/drizzle-study-goals-repository.ts

 Implementar DrizzleStudyGoalsRepository
 Método create():

Insert study_goals
Returning


 Método findByUserId():

Select where user_id
Retornar goal ou null


 Método update():

Update where user_id
Set daily_flashcards_goal, daily_quizzes_goal
Set updated_at = NOW()
Returning



Task 1.2: Service - Create Study Goals (Onboarding)
typescript// Criar: src/services/create-study-goals-service.ts

 Importar repositories
 Criar interface CreateStudyGoalsRequest:

userId: string
daily_flashcards_goal: number
daily_quizzes_goal: number


 Criar interface CreateStudyGoalsResponse:

goal: StudyGoal
user: User (com is_first_access atualizado)


 Classe CreateStudyGoalsService
 Construtor: UserRepository, StudyGoalsRepository
 Método execute():

Validar se usuário existe
Validar se já tem goal (findByUserId)

Se já existe → usar update ao invés de create


Criar/Atualizar study_goal
Atualizar user.is_first_access = false
Retornar { goal, user }



Task 1.3: Service - Get Study Goals
typescript// Criar: src/services/get-study-goals-service.ts

 Interface GetStudyGoalsRequest: userId
 Classe GetStudyGoalsService
 Construtor: StudyGoalsRepository
 Método execute():

Buscar goal por user_id
Se não existe → retornar valores padrão (20, 10)
Retornar goal



Task 1.4: Service - Update Study Goals
typescript// Criar: src/services/update-study-goals-service.ts

 Interface UpdateStudyGoalsRequest:

userId: string
daily_flashcards_goal?: number
daily_quizzes_goal?: number


 Classe UpdateStudyGoalsService
 Construtor: StudyGoalsRepository
 Método execute():

Validar que pelo menos um campo foi enviado
Atualizar goal
Retornar goal atualizado



Task 1.5: Factories - Study Goals
typescript// Criar: src/services/factories/make-create-study-goals.ts
// Criar: src/services/factories/make-get-study-goals.ts
// Criar: src/services/factories/make-update-study-goals.ts

 Instanciar repositories necessários
 Instanciar services
 Retornar services

Task 1.6: Controllers - Study Goals
typescript// Criar: src/http/controllers/goals/create-study-goals.controller.ts

 Schema body:

daily_flashcards_goal: number (min: 1, max: 100)
daily_quizzes_goal: number (min: 1, max: 50)


 Função createStudyGoals():

Validar body
Chamar service com userId
Retornar 201 + { goal, user }



typescript// Criar: src/http/controllers/goals/get-study-goals.controller.ts

 Função getStudyGoals():

Chamar service com userId
Retornar 200 + goal



typescript// Criar: src/http/controllers/goals/update-study-goals.controller.ts

 Schema body (todos opcionais):

daily_flashcards_goal?: number
daily_quizzes_goal?: number


 Função updateStudyGoals():

Validar body
Chamar service
Retornar 200 + goal



Task 1.7: Routes - Study Goals
typescript// Criar: src/http/routes/goals.routes.ts

 Hook: verifyJWT
 POST /goals → createStudyGoals
 GET /goals → getStudyGoals
 PUT /goals → updateStudyGoals
 Registrar no server.ts


📈 FASE 2: Study Sessions (Auto-incremento)
Task 2.1: Repository - Study Sessions
typescript// Criar: src/repositories/study-sessions-repository.ts

 Criar type StudySession = InferSelectModel<typeof study_sessions>
 Criar interface IncrementSessionData:

flashcards_studied?: number (default: 0)
flashcards_correct?: number (default: 0)
quizzes_completed?: number (default: 0)
quizzes_correct?: number (default: 0)


 Criar interface StudySessionRepository:

incrementToday(userId: string, data: IncrementSessionData) → Promise<StudySession>
findToday(userId: string) → Promise<StudySession | null>
findByDateRange(userId: string, startDate: Date, endDate: Date) → Promise<StudySession[]>
findRecent(userId: string, days: number) → Promise<StudySession[]>



typescript// Criar: src/repositories/drizzle/drizzle-study-sessions-repository.ts

 Implementar DrizzleStudySessionsRepository
 Método incrementToday():

Usar SQL INSERT ... ON CONFLICT DO UPDATE
Conflict target: (user_id, date) - unique constraint
On conflict: incrementar contadores com sql



typescript  await db.insert(study_sessions)
    .values({
      user_id: userId,
      date: startOfDay(new Date()),
      flashcards_studied: data.flashcards_studied || 0,
      ...
    })
    .onConflictDoUpdate({
      target: [study_sessions.user_id, study_sessions.date],
      set: {
        flashcards_studied: sql`${study_sessions.flashcards_studied} + ${data.flashcards_studied || 0}`,
        flashcards_correct: sql`${study_sessions.flashcards_correct} + ${data.flashcards_correct || 0}`,
        // ... outros campos
      }
    })
    .returning();

 Método findToday():

Pegar data de hoje (startOfDay)
Select where user_id AND date = today


 Método findByDateRange():

Select where user_id AND date BETWEEN startDate AND endDate
OrderBy date DESC


 Método findRecent():

Calcular startDate = hoje - days
Chamar findByDateRange



Task 2.2: Service - Increment Study Session
typescript// Criar: src/services/increment-study-session-service.ts

 Interface IncrementStudySessionRequest:

userId: string
type: "flashcard" | "quiz"
isCorrect?: boolean (opcional, para flashcard/quiz)


 Classe IncrementStudySessionService
 Construtor: StudySessionRepository
 Método execute():

Determinar quais campos incrementar:

Se type === "flashcard":

flashcards_studied: 1
flashcards_correct: isCorrect ? 1 : 0


Se type === "quiz":

quizzes_completed: 1
quizzes_correct: isCorrect ? 1 : 0




Chamar repository.incrementToday()
Retornar session atualizada



IMPORTANTE: Este service será chamado automaticamente por outros services!
Task 2.3: Integrar Incremento nas Ações
Integração A: ReviewFlashcardService
typescript// Editar: src/services/review-flashcard-service.ts

 Adicionar StudySessionRepository no construtor
 Adicionar IncrementStudySessionService no construtor (ou instanciar)
 Após atualizar flashcard (depois do calculateSM2):

typescript  // Determinar se acertou
  const isCorrect = difficulty === "good" || difficulty === "easy";
  
  // Incrementar sessão
  await incrementStudySession.execute({
    userId,
    type: "flashcard",
    isCorrect
  });
Integração B: AnswerQuizService
typescript// Editar: src/services/answer-quiz-service.ts

 Adicionar StudySessionRepository no construtor
 Adicionar IncrementStudySessionService no construtor
 Após validar resposta:

typescript  const isCorrect = selectedAnswer === quiz.correct_answer;
  
  // Incrementar sessão
  await incrementStudySession.execute({
    userId,
    type: "quiz",
    isCorrect
  });
Task 2.4: Atualizar Factories
typescript// Editar: src/services/factories/make-review-flashcard.ts
// Editar: src/services/factories/make-answer-quiz.ts

 Instanciar StudySessionRepository
 Passar para os services


📊 FASE 3: Dashboard (Estatísticas)
Task 3.1: Service - Get Dashboard Stats
typescript// Criar: src/services/get-dashboard-stats-service.ts

 Importar repositories
 Criar interface DashboardStats:

typescript  {
    // Progresso do dia
    today: {
      flashcards_studied: number;
      flashcards_correct: number;
      flashcards_accuracy: number; // %
      quizzes_completed: number;
      quizzes_correct: number;
      quizzes_accuracy: number; // %
      goals: {
        daily_flashcards_goal: number;
        daily_quizzes_goal: number;
        flashcards_progress: number; // %
        quizzes_progress: number; // %
      }
    };
    
    // Streak
    streak: {
      current: number; // dias consecutivos
      longest: number; // maior streak já alcançado
      last_study_date: Date | null;
    };
    
    // Totais gerais
    totals: {
      total_materials: number;
      total_flashcards: number;
      total_quizzes: number;
      total_study_days: number;
    };
    
    // Últimos 7 dias
    week: {
      date: Date;
      flashcards_studied: number;
      quizzes_completed: number;
    }[];
  }

 Classe GetDashboardStatsService
 Construtor: UserRepository, StudyGoalsRepository, StudySessionRepository, MaterialRepository, FlashcardRepository, QuizRepository
 Método execute(userId: string):
1. Buscar dados básicos:

 User (validar existe)
 Study goal
 Session de hoje (findToday)

2. Calcular progresso do dia:

typescript  const today = {
    flashcards_studied: todaySession?.flashcards_studied || 0,
    flashcards_correct: todaySession?.flashcards_correct || 0,
    flashcards_accuracy: calcularPorcentagem(correct, studied),
    quizzes_completed: todaySession?.quizzes_completed || 0,
    quizzes_correct: todaySession?.quizzes_correct || 0,
    quizzes_accuracy: calcularPorcentagem(correct, completed),
    goals: {
      daily_flashcards_goal: goal?.daily_flashcards_goal || 20,
      daily_quizzes_goal: goal?.daily_quizzes_goal || 10,
      flashcards_progress: calcularPorcentagem(studied, goal),
      quizzes_progress: calcularPorcentagem(completed, goal)
    }
  };
3. Calcular streak:

 Buscar sessões recentes (últimos 365 dias ou até quebrar)
 Implementar lógica de streak:

typescript  function calculateStreak(sessions: StudySession[]): { current: number, longest: number } {
    if (sessions.length === 0) return { current: 0, longest: 0 };
    
    // Ordenar por data DESC
    const sorted = sessions.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let expectedDate = startOfDay(new Date());
    
    for (const session of sorted) {
      const sessionDate = startOfDay(session.date);
      
      // Se é hoje ou ontem, continua streak
      if (isSameDay(sessionDate, expectedDate)) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        expectedDate = subDays(expectedDate, 1); // espera dia anterior
      } else if (isAfter(sessionDate, expectedDate)) {
        // Pulou um dia, quebrou streak
        if (currentStreak === 0) currentStreak = tempStreak;
        tempStreak = 0;
      }
    }
    
    if (currentStreak === 0) currentStreak = tempStreak;
    
    return { current: currentStreak, longest: longestStreak };
  }
4. Buscar totais:

 Count de materials (user_id)
 Count de flashcards (user_id)
 Count de quizzes (user_id)
 Count de study_sessions (user_id) = total_study_days

5. Buscar últimos 7 dias:

 findRecent(userId, 7)
 Mapear para formato { date, flashcards_studied, quizzes_completed }
 Preencher dias sem estudo com zeros

6. Retornar DashboardStats completo
Task 3.2: Service - Get Today Progress
typescript// Criar: src/services/get-today-progress-service.ts

 Interface TodayProgress:

typescript  {
    flashcards_studied: number;
    flashcards_goal: number;
    flashcards_remaining: number;
    flashcards_progress: number; // %
    
    quizzes_completed: number;
    quizzes_goal: number;
    quizzes_remaining: number;
    quizzes_progress: number; // %
    
    is_goal_complete: boolean;
  }

 Classe GetTodayProgressService
 Construtor: StudyGoalsRepository, StudySessionRepository
 Método execute(userId):

Buscar goal
Buscar session de hoje
Calcular remaining e progress
Verificar se completou meta
Retornar TodayProgress



Task 3.3: Factories - Dashboard
typescript// Criar: src/services/factories/make-get-dashboard-stats.ts
// Criar: src/services/factories/make-get-today-progress.ts

 Instanciar todos repositories necessários
 Instanciar services
 Retornar services

Task 3.4: Controllers - Dashboard
typescript// Criar: src/http/controllers/dashboard/get-dashboard-stats.controller.ts

 Função getDashboardStats():

Chamar service com userId
Retornar 200 + DashboardStats



typescript// Criar: src/http/controllers/dashboard/get-today-progress.controller.ts

 Função getTodayProgress():

Chamar service com userId
Retornar 200 + TodayProgress



typescript// Criar: src/http/controllers/dashboard/get-streak.controller.ts

 Função getStreak():

Chamar getDashboardStats
Retornar apenas streak
Retornar 200 + { current, longest, last_study_date }



Task 3.5: Routes - Dashboard
typescript// Criar: src/http/routes/dashboard.routes.ts

 Hook: verifyJWT
 GET /dashboard → getDashboardStats
 GET /dashboard/today → getTodayProgress
 GET /dashboard/streak → getStreak
 Registrar no server.ts


🧪 FASE 4: Testes
Task 4.1: Testar Onboarding (Study Goals)
Postman/Insomnia:

 Fazer login com usuário novo (is_first_access = true)
 POST /goals

Body: { "daily_flashcards_goal": 15, "daily_quizzes_goal": 8 }


 Verificar resposta 201 + goal + user
 Verificar user.is_first_access = false
 Fazer login novamente → não deve pedir onboarding
 GET /goals → verificar valores salvos

Task 4.2: Testar Update Goals
Postman/Insomnia:

 PUT /goals

Body: { "daily_flashcards_goal": 25 }


 Verificar resposta 200 + goal atualizado
 Verificar updated_at mudou
 GET /goals → confirmar mudança

Task 4.3: Testar Auto-incremento (Study Sessions)
Cenário completo:

 GET /dashboard/today → tudo zerado
 Revisar 1 flashcard (good) → POST /flashcards/{id}/review
 GET /dashboard/today → flashcards_studied = 1, flashcards_correct = 1
 Revisar 1 flashcard (again) → POST /flashcards/{id}/review
 GET /dashboard/today → flashcards_studied = 2, flashcards_correct = 1
 Responder 1 quiz corretamente → POST /quizzes/{id}/answer
 GET /dashboard/today → quizzes_completed = 1, quizzes_correct = 1
 Responder 1 quiz incorretamente
 GET /dashboard/today → quizzes_completed = 2, quizzes_correct = 1
 Verificar no banco: apenas 1 registro em study_sessions para hoje

Task 4.4: Testar Dashboard Completo
Postman/Insomnia:

 GET /dashboard
 Verificar estrutura completa:

today (com goals e progress)
streak (current, longest)
totals (materials, flashcards, quizzes, study_days)
week (array com 7 dias)


 Verificar cálculos:

flashcards_accuracy = (correct / studied) * 100
flashcards_progress = (studied / goal) * 100


 Verificar week:

Tem 7 elementos
Datas em ordem (mais recente primeiro)
Dias sem estudo têm valores zerados



Task 4.5: Testar Cálculo de Streak
Cenário 1: Streak simples

 Estudar hoje (criar session)
 GET /dashboard/streak → current = 1
 Criar session manual de ontem no banco
 GET /dashboard/streak → current = 2
 Criar session manual de 3 dias atrás (pular 1 dia)
 GET /dashboard/streak → current = 2 (streak quebrou)

Cenário 2: Longest streak

 Criar sessions manuais: hoje, ontem, 2 dias atrás
 Criar sessions manuais: 10 dias atrás, 11 dias atrás, 12 dias atrás
 GET /dashboard/streak

current = 3
longest = 3 (ou mais se já tinha)



Cenário 3: Sem estudo hoje

 NÃO estudar hoje
 Ter estudado ontem
 GET /dashboard/streak → current = 1 (ontem conta)

Task 4.6: Testar Edge Cases

 Dashboard sem nenhum estudo → tudo zerado
 Dashboard com goal null → usar defaults (20, 10)
 Progress > 100% → estudou mais que meta
 Accuracy com 0 estudos → 0% (não dividir por zero)
 Week com usuário novo → 7 dias zerados


🔧 FASE 5: Utilitários e Helpers
Task 5.1: Helper - Date Functions
typescript// Criar: src/lib/date-helpers.ts

 Função startOfDay(date: Date): Date

typescript  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;

 Função isSameDay(date1: Date, date2: Date): boolean
 Função subDays(date: Date, days: number): Date
 Função isAfter(date1: Date, date2: Date): boolean
 Função getDaysBetween(start: Date, end: Date): number

OU usar biblioteca: npm install date-fns
Task 5.2: Helper - Percentage Calculator
typescript// Criar: src/lib/math-helpers.ts

 Função calculatePercentage(value: number, total: number): number

typescript  if (total === 0) return 0;
  return Math.round((value / total) * 100);

 Função calculateAccuracy(correct: number, total: number): number

Alias para calculatePercentage




📊 FASE 6: Melhorias e Otimizações
Task 6.1: Cache de Dashboard
typescript// Futuro: Adicionar cache Redis

 Cache de 5 minutos para dashboard stats
 Invalidar cache ao estudar
 Key: dashboard:{userId}

Task 6.2: Notificações
typescript// Futuro: Notificar quando completar meta

 Webhook/Email quando atingir 100% da meta
 Push notification no frontend

Task 6.3: Badges/Conquistas
typescript// Futuro: Sistema de badges

 Badge "Primeira Semana" (streak 7 dias)
 Badge "Centurião" (100 flashcards em um dia)
 Badge "Consistência" (streak 30 dias)

Task 6.4: Leaderboard
typescript// Futuro: Ranking entre usuários

 Top 10 maiores streaks
 Top 10 mais estudaram esta semana
 Privacidade: opt-in


📋 Ordem Recomendada de Execução

✅ FASE 1: Study Goals (onboarding)
✅ FASE 2: Study Sessions (auto-incremento)
✅ FASE 5: Date Helpers (preparar para FASE 3)
✅ FASE 3: Dashboard (depende de tudo)
✅ FASE 4: Testes (validação completa)
⏭️ FASE 6: Melhorias (quando tiver tempo)


🚨 Pontos Críticos
⚠️ Unique Constraint em study_sessions
sql-- Certifique-se que existe no schema
ALTER TABLE study_sessions 
ADD CONSTRAINT study_sessions_user_date_unique 
UNIQUE (user_id, date);

 Verificar se constraint existe
 Se não existe, criar migration

⚠️ Timezone

Sempre usar UTC no banco
Converter para timezone do usuário no frontend
startOfDay() deve considerar UTC

⚠️ Divisão por Zero
typescript// ❌ Erro
const accuracy = (correct / total) * 100;

// ✅ Correto
const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);
⚠️ Performance do Streak

Limitar query a últimos 365 dias
Parar cálculo ao encontrar gap > 1 dia
Não calcular em tempo real toda vez (considerar cache)

⚠️ Consistência de Dados

incrementToday() deve ser atômico (transaction)
Usar ON CONFLICT DO UPDATE para evitar race condition
Teste: 2 reviews simultâneos devem incrementar corretamente


📁 Estrutura Final
src/
├── lib/
│   ├── date-helpers.ts         ⬜ Criar
│   └── math-helpers.ts         ⬜ Criar
├── repositories/
│   ├── study-goals-repository.ts
│   ├── study-sessions-repository.ts
│   └── drizzle/
│       ├── drizzle-study-goals-repository.ts
│       └── drizzle-study-sessions-repository.ts
├── services/
│   ├── create-study-goals-service.ts
│   ├── get-study-goals-service.ts
│   ├── update-study-goals-service.ts
│   ├── increment-study-session-service.ts
│   ├── get-dashboard-stats-service.ts
│   ├── get-today-progress-service.ts
│   └── factories/
│       └── ... (todas as factories)
├── http/
│   ├── controllers/
│   │   ├── goals/
│   │   │   ├── create-study-goals.controller.ts
│   │   │   ├── get-study-goals.controller.ts
│   │   │   └── update-study-goals.controller.ts
│   │   └── dashboard/
│   │       ├── get-dashboard-stats.controller.ts
│   │       ├── get-today-progress.controller.ts
│   │       └── get-streak.controller.ts
│   └── routes/
│       ├── goals.routes.ts
│       └── dashboard.routes.ts
└── server.ts

🎯 Você está aqui:
[✅] Materials + IA
[✅] Summaries, Quizzes, Flashcards
[  ] Study Goals (FASE 1)
[  ] Study Sessions (FASE 2)
[  ] Dashboard (FASE 3)
[  ] Testes (FASE 4)

💡 Dicas
Testando Auto-incremento
bash# Terminal 1
npm run dev

# Terminal 2 - Revisar flashcard
curl -X POST http://localhost:3333/flashcards/{id}/review \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"difficulty": "good"}'

# Terminal 3 - Ver progresso
curl http://localhost:3333/dashboard/today \
  -H "Authorization: Bearer $TOKEN"
Debugging Streak
typescript// Adicionar logs temporários
console.log('Sessions:', sessions.map(s => ({
  date: s.date.toISOString().split('T')[0],
  flashcards: s.flashcards_studied
})));
SQL Útil
sql-- Ver sessões de um usuário
SELECT * FROM study_sessions 
WHERE user_id = 'uuid-aqui' 
ORDER BY date DESC;

-- Criar sessão manual (teste)
INSERT INTO study_sessions (user_id, date, flashcards_studied)
VALUES ('uuid-aqui', '2025-01-14', 5);

📚 Referências

Upsert no Drizzle
SQL Increment Pattern
Date-fns Documentation
Streak Algorithm


📊 Exemplo de Response - Dashboard
json{
  "today": {
    "flashcards_studied": 12,
    "flashcards_correct": 10,
    "flashcards_accuracy": 83,
    "quiz
    